from django.contrib.auth.models import User
from rest_framework import serializers, exceptions
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import PesquisadorProfile, Projeto, Artigo


# -------------------------------------------------------
# AUTENTICAÇÃO
# -------------------------------------------------------

class CustomTokenObtainPairSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed(
                'Credenciais inválidas. Verifique o email e a senha.',
                'no_active_account',
            )

        if not user.check_password(password):
            raise exceptions.AuthenticationFailed(
                'Credenciais inválidas. Verifique o email e a senha.',
                'no_active_account',
            )

        if not user.is_active:
            raise exceptions.AuthenticationFailed(
                'Esta conta está inativa.',
                'no_active_account',
            )

        refresh = RefreshToken.for_user(user)
        
        # Adiciona claims customizadas ao token
        refresh['email'] = user.email
        refresh['first_name'] = user.first_name
        refresh['last_name'] = user.last_name

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# -------------------------------------------------------
# CAMPO CUSTOMIZADO: aceita string vazia como null em datas
# -------------------------------------------------------

class NullableDateField(serializers.DateField):
    """DateField que converte string vazia ('') para None."""
    def to_internal_value(self, value):
        if value == '' or value is None:
            return None
        return super().to_internal_value(value)


# -------------------------------------------------------
# PESQUISADOR
# Campos usados pelo front: id, name, email, area, bio, link, status
# -------------------------------------------------------

class PesquisadorProfileSerializer(serializers.ModelSerializer):
    # Campos vindos do User nativo do Django
    name = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()

    # Mapeamento: campo do front → campo do model
    area = serializers.CharField(
        source='area_atuacao', required=False,
        allow_blank=True, allow_null=True
    )
    link = serializers.URLField(
        source='lattes_url', required=False,
        allow_blank=True, allow_null=True
    )

    # Status fixo para M2; pode ser dinâmico no M3
    status = serializers.SerializerMethodField()

    class Meta:
        model = PesquisadorProfile
        fields = ['id', 'name', 'email', 'area', 'bio', 'link', 'status']

    def get_name(self, obj):
        return obj.user.get_full_name() or obj.user.username

    def get_email(self, obj):
        return obj.user.email

    def get_status(self, obj):
        return 'Ativo'


class PesquisadorCreateSerializer(serializers.Serializer):
    """Cria User + PesquisadorProfile a partir dos campos do front."""
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    # Senha removida para impedir login de pesquisador
    area = serializers.CharField(max_length=255, required=False, allow_blank=True, default='')
    link = serializers.URLField(required=False, allow_blank=True, allow_null=True, default=None)
    bio = serializers.CharField(required=False, allow_blank=True, default='')
    nivel_acesso = serializers.ChoiceField(
        choices=['membro', 'coordenador', 'admin'],
        default='membro', required=False
    )

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Já existe um pesquisador com este email.')
        return value

    def create(self, validated_data):
        name = validated_data['name']
        email = validated_data['email']
        password = validated_data.get('password', 'Labic@2026!')
        area = validated_data.get('area', '')
        link = validated_data.get('link') or None  # '' → None
        bio = validated_data.get('bio', '')
        nivel_acesso = validated_data.get('nivel_acesso', 'membro')

        partes = name.split(' ', 1)
        first_name = partes[0]
        last_name = partes[1] if len(partes) > 1 else ''

        # admin no model → is_staff=True no Django para funcionar com exigir_admin_para_escrita
        is_staff = (nivel_acesso == 'admin')

        user = User(
            username=email,
            email=email,
            first_name=first_name,
            last_name=last_name,
            is_staff=is_staff,
        )
        user.set_unusable_password()
        user.save()
        
        profile = PesquisadorProfile.objects.create(
            user=user,
            area_atuacao=area or None,
            lattes_url=link,
            bio=bio or None,
            nivel_acesso=nivel_acesso,
        )
        return profile


# -------------------------------------------------------
# PROJETO
# Campos usados pelo front: id, title, status, startDate, endDate
# -------------------------------------------------------

class ProjetoSerializer(serializers.ModelSerializer):
    # Mapeamento: campo do front → campo do model
    title = serializers.CharField(source='titulo')
    area = serializers.CharField(source='area_pesquisa', required=False, allow_blank=True, allow_null=True)
    startDate = serializers.DateField(source='data_inicio', required=True, allow_null=False)

    class Meta:
        model = Projeto
        fields = ['id', 'title', 'descricao', 'responsavel', 'area', 'status', 'startDate']

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('O título do projeto é obrigatório.')
        return value


# -------------------------------------------------------
# ARTIGO
# Campos usados pelo front: id, title, authors, date, status, relatedArea
# -------------------------------------------------------

class ArtigoSerializer(serializers.ModelSerializer):
    # Mapeamento: campo do front → campo do model
    title = serializers.CharField(source='titulo')
    abstract = serializers.CharField(source='resumo', required=False, allow_blank=True, default='')
    methodology = serializers.CharField(source='metodologia', required=False, allow_blank=True, default='')
    literatureReview = serializers.CharField(source='revisao_bibliografica', required=False, allow_blank=True, default='')
    relatedArea = serializers.CharField(
        source='area_relacionada', required=False,
        allow_blank=True, allow_null=True
    )
    # Data formatada igual ao front: "15 Mai 2026"
    date = serializers.SerializerMethodField()

    class Meta:
        model = Artigo
        fields = ['id', 'title', 'abstract', 'methodology', 'literatureReview', 'authors', 'date', 'status', 'relatedArea']

    def get_date(self, obj):
        months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        d = obj.data_publicacao or (obj.criado_em.date() if obj.criado_em else None)
        if d:
            return f"{d.day:02d} {months[d.month - 1]} {d.year}"
        return ''

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('O título do artigo é obrigatório.')
        return value
