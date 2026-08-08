from django.db import models
from django.contrib.auth.models import User


# --- PESQUISADOR PROFILE ---
class PesquisadorProfile(models.Model):
    NIVEL_ACESSO_CHOICES = [
        ('membro', 'Membro'),
        ('coordenador', 'Coordenador'),
        ('admin', 'Admin'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    area_atuacao = models.CharField(max_length=255, blank=True, null=True)
    lattes_url = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    foto_url = models.URLField(blank=True, null=True)
    nivel_acesso = models.CharField(max_length=20, choices=NIVEL_ACESSO_CHOICES, default='membro')

    def __str__(self):
        return f"Perfil de {self.user.get_full_name() or self.user.username}"

    class Meta:
        verbose_name = 'Perfil de Pesquisador'
        verbose_name_plural = 'Perfis de Pesquisadores'


# --- PROJETO ---
class Projeto(models.Model):
    # Valores iguais ao front para funcionar sem conversão
    STATUS_CHOICES = [
        ('Em Planejamento', 'Em Planejamento'),
        ('Ativo', 'Ativo'),
        ('Em Execução', 'Em Execução'),
        ('Concluído', 'Concluído'),
        ('Pausado', 'Pausado'),
    ]

    titulo = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, default='')
    area_pesquisa = models.CharField(max_length=255, blank=True, null=True)
    responsavel = models.CharField(max_length=255, blank=True, null=True)
    data_inicio = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Em Planejamento')
    equipe = models.ManyToManyField(User, related_name='projetos', blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.titulo

    class Meta:
        verbose_name = 'Projeto'
        verbose_name_plural = 'Projetos'
        ordering = ['-criado_em']


# --- ARTIGO ---
class Artigo(models.Model):
    # Valores iguais ao front para funcionar sem conversão
    STATUS_CHOICES = [
        ('Ativo', 'Ativo'),
        ('Em Execução', 'Em Execução'),
        ('Concluído', 'Concluído'),
    ]

    titulo = models.CharField(max_length=255)
    resumo = models.TextField(blank=True, default='')
    metodologia = models.TextField(blank=True, default='')
    revisao_bibliografica = models.TextField(blank=True, default='')

    # Campo para o front: string de autores (ex: "A. Silva, B. Costa")
    authors = models.TextField(blank=True, default='')

    area_relacionada = models.CharField(max_length=255, blank=True, null=True)
    pdf_url = models.URLField(blank=True, null=True)
    data_publicacao = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Ativo')

    projeto = models.ForeignKey(
        Projeto, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='artigos'
    )
    # Mantido para uso futuro (M3)
    autores = models.ManyToManyField(User, related_name='artigos', blank=True)

    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.titulo

    class Meta:
        verbose_name = 'Artigo'
        verbose_name_plural = 'Artigos'
        ordering = ['-criado_em']
