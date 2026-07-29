"""
Suite de testes da API LABIC.

Cobertura:
  1. POST /auth/login/ com credenciais válidas → access + refresh
  2. POST /auth/login/ com credenciais erradas → 401
  3. GET  /pesquisadores/, /projetos/, /artigos/ sem autenticação → 200
  4. POST/DELETE nessas rotas sem token → 401
  5. POST/DELETE com token de usuário comum (não-staff) → 403
  6. POST/PUT/DELETE com token de admin (is_staff=True) → 201 / 200 / 204
"""

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

from .models import Projeto, Artigo, PesquisadorProfile


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _get_token(client, email, password):
    """Faz login e devolve o access token."""
    resp = client.post(
        '/auth/login/',
        {'email': email, 'password': password},
        format='json',
    )
    return resp.data.get('access')


def _auth_header(token):
    return {'HTTP_AUTHORIZATION': f'Bearer {token}'}


# ---------------------------------------------------------------------------
# 1 & 2 — Autenticação
# ---------------------------------------------------------------------------

class AuthLoginTests(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='admin@labic.edu',
            email='admin@labic.edu',
            password='Senha@Forte123',
            is_staff=True,
        )

    # 1) Login com credenciais válidas retorna access + refresh
    def test_login_valido_retorna_tokens(self):
        resp = self.client.post(
            '/auth/login/',
            {'email': 'admin@labic.edu', 'password': 'Senha@Forte123'},
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn('access', resp.data)
        self.assertIn('refresh', resp.data)

    # 2) Login com senha errada retorna 401
    def test_login_invalido_retorna_401(self):
        resp = self.client.post(
            '/auth/login/',
            {'email': 'admin@labic.edu', 'password': 'senhaerrada'},
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    # 2b) Login com e-mail inexistente retorna 401
    def test_login_email_inexistente_retorna_401(self):
        resp = self.client.post(
            '/auth/login/',
            {'email': 'naoexiste@labic.edu', 'password': 'qualquer'},
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)


# ---------------------------------------------------------------------------
# 3, 4, 5 & 6 — Pesquisadores
# ---------------------------------------------------------------------------

class PesquisadoresTests(APITestCase):

    def setUp(self):
        self.client = APIClient()

        # Usuário admin (is_staff=True)
        self.admin = User.objects.create_user(
            username='admin@labic.edu',
            email='admin@labic.edu',
            password='Senha@Forte123',
            is_staff=True,
            first_name='Admin',
            last_name='LABIC',
        )

        # Usuário comum (is_staff=False)
        self.comum = User.objects.create_user(
            username='membro@labic.edu',
            email='membro@labic.edu',
            password='Senha@Forte123',
            is_staff=False,
        )

        # Perfil vinculado ao admin para poder ser deletado nos testes
        self.perfil = PesquisadorProfile.objects.create(
            user=self.admin,
            nivel_acesso='admin',
        )

        self.admin_token = _get_token(self.client, 'admin@labic.edu', 'Senha@Forte123')
        self.comum_token = _get_token(self.client, 'membro@labic.edu', 'Senha@Forte123')

        self.payload = {
            'name': 'Dr. Novo Pesquisador',
            'email': 'novo@labic.edu',
            'password': 'Senha@Forte123',
            'area': 'Inteligência Artificial',
        }

    # 3) GET sem autenticação → 200
    def test_get_pesquisadores_publico(self):
        resp = self.client.get('/pesquisadores/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    # 4) POST sem token → 401
    def test_post_pesquisadores_sem_token_retorna_401(self):
        resp = self.client.post('/pesquisadores/', self.payload, format='json')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    # 4b) DELETE sem token → 401
    def test_delete_pesquisador_sem_token_retorna_401(self):
        resp = self.client.delete(f'/pesquisadores/{self.perfil.id}/')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    # 5) POST com token de usuário comum → 403
    def test_post_pesquisadores_comum_retorna_403(self):
        resp = self.client.post(
            '/pesquisadores/', self.payload, format='json',
            **_auth_header(self.comum_token),
        )
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    # 5b) DELETE com token de usuário comum → 403
    def test_delete_pesquisador_comum_retorna_403(self):
        resp = self.client.delete(
            f'/pesquisadores/{self.perfil.id}/',
            **_auth_header(self.comum_token),
        )
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    # 6) POST com token de admin → 201
    def test_post_pesquisadores_admin_retorna_201(self):
        resp = self.client.post(
            '/pesquisadores/', self.payload, format='json',
            **_auth_header(self.admin_token),
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

    # 6b) DELETE com token de admin → 204
    def test_delete_pesquisador_admin_retorna_204(self):
        # Cria um usuário extra para deletar sem afetar o admin de setUp
        user_extra = User.objects.create_user(
            username='extra@labic.edu', email='extra@labic.edu', password='x'
        )
        perfil_extra = PesquisadorProfile.objects.create(user=user_extra)
        resp = self.client.delete(
            f'/pesquisadores/{perfil_extra.id}/',
            **_auth_header(self.admin_token),
        )
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)


# ---------------------------------------------------------------------------
# 3, 4, 5 & 6 — Projetos
# ---------------------------------------------------------------------------

class ProjetosTests(APITestCase):

    def setUp(self):
        self.client = APIClient()

        self.admin = User.objects.create_user(
            username='admin@labic.edu',
            email='admin@labic.edu',
            password='Senha@Forte123',
            is_staff=True,
        )
        self.comum = User.objects.create_user(
            username='membro@labic.edu',
            email='membro@labic.edu',
            password='Senha@Forte123',
        )

        self.projeto = Projeto.objects.create(titulo='Projeto Teste', status='Ativo')

        self.admin_token = _get_token(self.client, 'admin@labic.edu', 'Senha@Forte123')
        self.comum_token = _get_token(self.client, 'membro@labic.edu', 'Senha@Forte123')

        self.payload = {'title': 'Novo Projeto', 'status': 'Em Planejamento'}

    # 3) GET sem autenticação → 200
    def test_get_projetos_publico(self):
        resp = self.client.get('/projetos/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    # 4) POST sem token → 401
    def test_post_projetos_sem_token_retorna_401(self):
        resp = self.client.post('/projetos/', self.payload, format='json')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    # 4b) DELETE sem token → 401
    def test_delete_projeto_sem_token_retorna_401(self):
        resp = self.client.delete(f'/projetos/{self.projeto.id}/')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    # 5) POST com usuário comum → 403
    def test_post_projetos_comum_retorna_403(self):
        resp = self.client.post(
            '/projetos/', self.payload, format='json',
            **_auth_header(self.comum_token),
        )
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    # 5b) DELETE com usuário comum → 403
    def test_delete_projeto_comum_retorna_403(self):
        resp = self.client.delete(
            f'/projetos/{self.projeto.id}/',
            **_auth_header(self.comum_token),
        )
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    # 6) POST com admin → 201
    def test_post_projetos_admin_retorna_201(self):
        resp = self.client.post(
            '/projetos/', self.payload, format='json',
            **_auth_header(self.admin_token),
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

    # 6b) PUT com admin → 200
    def test_put_projeto_admin_retorna_200(self):
        resp = self.client.put(
            f'/projetos/{self.projeto.id}/',
            {'title': 'Projeto Atualizado'},
            format='json',
            **_auth_header(self.admin_token),
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    # 6c) DELETE com admin → 204
    def test_delete_projeto_admin_retorna_204(self):
        resp = self.client.delete(
            f'/projetos/{self.projeto.id}/',
            **_auth_header(self.admin_token),
        )
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)


# ---------------------------------------------------------------------------
# 3, 4, 5 & 6 — Artigos
# ---------------------------------------------------------------------------

class ArtigosTests(APITestCase):

    def setUp(self):
        self.client = APIClient()

        self.admin = User.objects.create_user(
            username='admin@labic.edu',
            email='admin@labic.edu',
            password='Senha@Forte123',
            is_staff=True,
        )
        self.comum = User.objects.create_user(
            username='membro@labic.edu',
            email='membro@labic.edu',
            password='Senha@Forte123',
        )

        self.artigo = Artigo.objects.create(titulo='Artigo Teste', status='Ativo')

        self.admin_token = _get_token(self.client, 'admin@labic.edu', 'Senha@Forte123')
        self.comum_token = _get_token(self.client, 'membro@labic.edu', 'Senha@Forte123')

        self.payload = {'title': 'Novo Artigo', 'authors': 'A. Silva'}

    # 3) GET sem autenticação → 200
    def test_get_artigos_publico(self):
        resp = self.client.get('/artigos/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    # 4) POST sem token → 401
    def test_post_artigos_sem_token_retorna_401(self):
        resp = self.client.post('/artigos/', self.payload, format='json')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    # 4b) DELETE sem token → 401
    def test_delete_artigo_sem_token_retorna_401(self):
        resp = self.client.delete(f'/artigos/{self.artigo.id}/')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    # 5) POST com usuário comum → 403
    def test_post_artigos_comum_retorna_403(self):
        resp = self.client.post(
            '/artigos/', self.payload, format='json',
            **_auth_header(self.comum_token),
        )
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    # 5b) DELETE com usuário comum → 403
    def test_delete_artigo_comum_retorna_403(self):
        resp = self.client.delete(
            f'/artigos/{self.artigo.id}/',
            **_auth_header(self.comum_token),
        )
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    # 6) POST com admin → 201
    def test_post_artigos_admin_retorna_201(self):
        resp = self.client.post(
            '/artigos/', self.payload, format='json',
            **_auth_header(self.admin_token),
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

    # 6b) PUT com admin → 200
    def test_put_artigo_admin_retorna_200(self):
        resp = self.client.put(
            f'/artigos/{self.artigo.id}/',
            {'title': 'Artigo Atualizado'},
            format='json',
            **_auth_header(self.admin_token),
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    # 6c) DELETE com admin → 204
    def test_delete_artigo_admin_retorna_204(self):
        resp = self.client.delete(
            f'/artigos/{self.artigo.id}/',
            **_auth_header(self.admin_token),
        )
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
