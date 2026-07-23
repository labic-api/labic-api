from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, exceptions
from django.shortcuts import get_object_or_404

from .models import PesquisadorProfile, Projeto, Artigo
from .serializers import (
    PesquisadorProfileSerializer,
    PesquisadorCreateSerializer,
    ProjetoSerializer,
    ArtigoSerializer,
)


def exigir_admin_para_escrita(request):
    """Barra POST/PUT/DELETE de quem não for admin autenticado."""
    if request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
        if not request.user or not request.user.is_authenticated:
            raise exceptions.NotAuthenticated(
                detail='Autenticação necessária. Envie um Token JWT válido no header Authorization.'
            )
        if not (request.user.is_staff or request.user.is_superuser):
            raise exceptions.PermissionDenied(
                detail='Acesso negado. Apenas administradores podem realizar esta operação.'
            )


@api_view(['GET'])
def home(request):
    return Response({"message": "Bem-vindo à API do LABIC - MVP v2"})


# -------------------------------------------------------
# PESQUISADORES
# -------------------------------------------------------

@api_view(['GET', 'POST'])
def pesquisadores(request):
    exigir_admin_para_escrita(request)

    if request.method == 'GET':
        perfis = PesquisadorProfile.objects.select_related('user').all()
        return Response(PesquisadorProfileSerializer(perfis, many=True).data)

    serializer = PesquisadorCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    perfil = serializer.save()
    return Response(PesquisadorProfileSerializer(perfil).data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT', 'DELETE'])
def pesquisador_detail(request, id):
    exigir_admin_para_escrita(request)
    perfil = get_object_or_404(PesquisadorProfile, id=id)

    if request.method == 'GET':
        return Response(PesquisadorProfileSerializer(perfil).data)

    if request.method == 'PUT':
        serializer = PesquisadorProfileSerializer(perfil, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Atualizar dados do User (nome e email) se enviados, pois no serializer eles são read-only
        user = perfil.user
        user_updated = False
        if 'name' in request.data:
            name = request.data.get('name')
            partes = name.split(' ', 1)
            user.first_name = partes[0]
            user.last_name = partes[1] if len(partes) > 1 else ''
            user_updated = True
        
        if 'email' in request.data:
            # O ideal é validar se o e-mail não existe em outro usuário,
            # mas simplificando para o escopo atual:
            user.email = request.data.get('email')
            user.username = request.data.get('email')
            user_updated = True
            
        if user_updated:
            user.save()

        # Retornamos o serializer com os dados atualizados
        return Response(PesquisadorProfileSerializer(perfil).data)

    perfil.user.delete()  # deleta User e Profile em cascata
    return Response(status=status.HTTP_204_NO_CONTENT)


# -------------------------------------------------------
# PROJETOS
# -------------------------------------------------------

@api_view(['GET', 'POST'])
def projetos(request):
    exigir_admin_para_escrita(request)

    if request.method == 'GET':
        lista = Projeto.objects.all()
        return Response(ProjetoSerializer(lista, many=True).data)

    serializer = ProjetoSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT', 'DELETE'])
def projeto_detail(request, id):
    exigir_admin_para_escrita(request)
    projeto = get_object_or_404(Projeto, id=id)

    if request.method == 'GET':
        return Response(ProjetoSerializer(projeto).data)

    if request.method == 'PUT':
        serializer = ProjetoSerializer(projeto, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    projeto.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# -------------------------------------------------------
# ARTIGOS
# -------------------------------------------------------

@api_view(['GET', 'POST'])
def artigos(request):
    exigir_admin_para_escrita(request)

    if request.method == 'GET':
        lista = Artigo.objects.select_related('projeto').all()
        return Response(ArtigoSerializer(lista, many=True).data)

    serializer = ArtigoSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT', 'DELETE'])
def artigo_detail(request, id):
    exigir_admin_para_escrita(request)
    artigo = get_object_or_404(Artigo, id=id)

    if request.method == 'GET':
        return Response(ArtigoSerializer(artigo).data)

    if request.method == 'PUT':
        serializer = ArtigoSerializer(artigo, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    artigo.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
