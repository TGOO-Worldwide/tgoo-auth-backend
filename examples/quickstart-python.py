"""
TGOO Auth - Quick Start Python

Este é um exemplo minimalista de integração com o sistema de autenticação TGOO.
Para documentação completa, consulte: INTEGRATION_GUIDE.md

Instalação:
    pip install requests

Uso:
    python quickstart-python.py
"""

import requests
import json
from typing import Optional, Dict, Any

# ============================================================================
# CONFIGURAÇÃO
# ============================================================================

API_URL = "https://auth.tgoo.eu/api"
PLATFORM_CODE = "dressme"

# ============================================================================
# CLIENT DE AUTENTICAÇÃO
# ============================================================================

class TGOOAuthClient:
    """Cliente simplificado para autenticação TGOO"""
    
    def __init__(self, api_url: str = API_URL, platform: str = PLATFORM_CODE):
        self.api_url = api_url.rstrip('/')
        self.platform = platform
        self.token: Optional[str] = None
        self._user: Optional[Dict[str, Any]] = None
    
    def _headers(self) -> Dict[str, str]:
        """Retorna headers com token se autenticado"""
        headers = {"Content-Type": "application/json"}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        return headers
    
    def _handle_response(self, response: requests.Response) -> Dict[str, Any]:
        """Processa resposta da API"""
        try:
            data = response.json()
        except json.JSONDecodeError:
            raise Exception(f"Erro ao decodificar resposta: {response.text}")
        
        if response.status_code >= 400:
            error_msg = data.get('error', 'Erro desconhecido')
            raise Exception(f"[{response.status_code}] {error_msg}")
        
        return data
    
    # ========================================================================
    # MÉTODOS PÚBLICOS
    # ========================================================================
    
    def login(self, email: str, password: str) -> Dict[str, Any]:
        """
        Fazer login e retornar dados do usuário
        
        Args:
            email: Email do usuário
            password: Senha do usuário
            
        Returns:
            Dict com 'token' e 'user'
            
        Raises:
            Exception: Se login falhar
        """
        response = requests.post(
            f"{self.api_url}/auth/login",
            json={
                "email": email,
                "password": password,
                "platform": self.platform
            },
            headers=self._headers()
        )
        
        data = self._handle_response(response)
        
        # Salvar token e usuário
        self.token = data['token']
        self._user = data['user']
        
        return data
    
    def signup(self, email: str, password: str, full_name: Optional[str] = None) -> Dict[str, Any]:
        """
        Criar nova conta
        
        Args:
            email: Email do usuário
            password: Senha (mínimo 6 caracteres)
            full_name: Nome completo (opcional)
            
        Returns:
            Dict com 'message' e 'user'
            
        Raises:
            Exception: Se registro falhar
        """
        payload = {
            "email": email,
            "password": password,
            "platform": self.platform
        }
        
        if full_name:
            payload["fullName"] = full_name
        
        response = requests.post(
            f"{self.api_url}/auth/signup",
            json=payload,
            headers=self._headers()
        )
        
        return self._handle_response(response)
    
    def get_profile(self) -> Dict[str, Any]:
        """
        Obter perfil do usuário autenticado
        
        Returns:
            Dict com dados do usuário
            
        Raises:
            Exception: Se não autenticado ou erro na requisição
        """
        if not self.token:
            raise Exception("Não autenticado. Faça login primeiro.")
        
        response = requests.get(
            f"{self.api_url}/auth/profile",
            headers=self._headers()
        )
        
        data = self._handle_response(response)
        self._user = data
        
        return data
    
    def change_password(self, old_password: str, new_password: str) -> None:
        """
        Alterar senha do usuário
        
        Args:
            old_password: Senha atual
            new_password: Nova senha
            
        Raises:
            Exception: Se não autenticado ou erro na requisição
        """
        if not self.token:
            raise Exception("Não autenticado. Faça login primeiro.")
        
        response = requests.post(
            f"{self.api_url}/password/change",
            json={
                "oldPassword": old_password,
                "newPassword": new_password
            },
            headers=self._headers()
        )
        
        self._handle_response(response)
    
    def logout(self) -> None:
        """Fazer logout (limpar token local)"""
        self.token = None
        self._user = None
    
    def is_authenticated(self) -> bool:
        """Verificar se está autenticado"""
        return self.token is not None
    
    @property
    def user(self) -> Optional[Dict[str, Any]]:
        """Retorna dados do usuário atual"""
        return self._user

# ============================================================================
# FUNÇÕES AUXILIARES
# ============================================================================

def print_user_info(user: Dict[str, Any]) -> None:
    """Exibir informações do usuário formatadas"""
    print("\n" + "="*50)
    print("INFORMAÇÕES DO USUÁRIO")
    print("="*50)
    print(f"ID: {user['id']}")
    print(f"Email: {user['email']}")
    print(f"Nome: {user.get('fullName', 'N/A')}")
    print(f"Role: {user['role']}")
    print(f"Status: {user['status']}")
    print(f"Plataforma: {user['platform']['name']} ({user['platform']['code']})")
    print("="*50 + "\n")

def list_platforms(api_url: str = API_URL) -> None:
    """Listar plataformas disponíveis"""
    response = requests.get(f"{api_url}/auth/platforms")
    platforms = response.json()
    
    print("\n" + "="*50)
    print("PLATAFORMAS DISPONÍVEIS")
    print("="*50)
    for p in platforms:
        print(f"• {p['name']} (code: {p['code']})")
        if p.get('domain'):
            print(f"  Domain: {p['domain']}")
        if p.get('description'):
            print(f"  {p['description']}")
        print()
    print("="*50 + "\n")

# ============================================================================
# EXEMPLO DE USO
# ============================================================================

def main():
    """Exemplo completo de uso"""
    
    print("🔐 TGOO Auth - Exemplo Python\n")
    
    # Criar cliente
    auth = TGOOAuthClient(
        api_url=API_URL,
        platform=PLATFORM_CODE
    )
    
    # Listar plataformas disponíveis
    print("1. Listando plataformas disponíveis...")
    try:
        list_platforms()
    except Exception as e:
        print(f"⚠️  Erro ao listar plataformas: {e}\n")
    
    # Exemplo 1: Criar nova conta (descomente para testar)
    # print("2. Criando nova conta...")
    # try:
    #     result = auth.signup(
    #         email="teste@example.com",
    #         password="senha123",
    #         full_name="Usuário Teste"
    #     )
    #     print(f"✅ {result['message']}\n")
    # except Exception as e:
    #     print(f"❌ Erro ao criar conta: {e}\n")
    
    # Exemplo 2: Login
    print("2. Fazendo login...")
    try:
        result = auth.login(
            email="admin@tgoo.eu",  # Ajuste conforme necessário
            password="Senha@123"     # Ajuste conforme necessário
        )
        print("✅ Login bem-sucedido!")
        print(f"Token (primeiros 30 chars): {result['token'][:30]}...")
        print_user_info(result['user'])
    except Exception as e:
        print(f"❌ Erro ao fazer login: {e}")
        print("💡 Dica: Ajuste email/senha no código ou crie um usuário primeiro\n")
        return
    
    # Exemplo 3: Obter perfil
    print("3. Obtendo perfil atualizado...")
    try:
        profile = auth.get_profile()
        print("✅ Perfil obtido com sucesso!")
        print_user_info(profile)
    except Exception as e:
        print(f"❌ Erro ao obter perfil: {e}\n")
    
    # Exemplo 4: Verificar autenticação
    print("4. Verificando autenticação...")
    if auth.is_authenticated():
        print("✅ Usuário está autenticado")
        print(f"Role: {auth.user['role']}")
        print(f"Status: {auth.user['status']}\n")
    else:
        print("❌ Usuário não está autenticado\n")
    
    # Exemplo 5: Logout
    print("5. Fazendo logout...")
    auth.logout()
    print("✅ Logout realizado com sucesso")
    print(f"Autenticado: {auth.is_authenticated()}\n")

# ============================================================================
# EXEMPLO AVANÇADO: GERENCIAMENTO DE SESSÃO
# ============================================================================

class SessionManager:
    """Gerenciador de sessão com persistência em arquivo"""
    
    def __init__(self, session_file: str = ".tgoo_session"):
        self.session_file = session_file
        self.client = TGOOAuthClient()
    
    def save_session(self) -> None:
        """Salvar token em arquivo"""
        if self.client.token:
            with open(self.session_file, 'w') as f:
                json.dump({
                    'token': self.client.token,
                    'user': self.client.user
                }, f)
    
    def load_session(self) -> bool:
        """Carregar token de arquivo"""
        try:
            with open(self.session_file, 'r') as f:
                data = json.load(f)
                self.client.token = data['token']
                self.client._user = data['user']
                
                # Validar token
                self.client.get_profile()
                return True
        except (FileNotFoundError, Exception):
            return False
    
    def clear_session(self) -> None:
        """Limpar sessão"""
        self.client.logout()
        try:
            import os
            os.remove(self.session_file)
        except FileNotFoundError:
            pass

# ============================================================================
# EXECUTAR
# ============================================================================

if __name__ == "__main__":
    main()
    
    # Para usar gerenciamento de sessão:
    # session = SessionManager()
    # if session.load_session():
    #     print("Sessão restaurada!")
    # else:
    #     # Fazer login...
    #     session.save_session()

