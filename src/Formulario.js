import { useState } from 'react';
import './App.css';
import { enviarCodigo, verificarCodigo } from './services/api';
import logo from './assets/logo-hanover-tavares.png';

function formatarTelefone(valor) {
  const numeros = valor.replace(/\D/g, '').slice(0, 11);

  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 7) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  }
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

function formatarCnpj(valor) {
  const numeros = valor.replace(/\D/g, '').slice(0, 14);

  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 5) return `${numeros.slice(0, 2)}.${numeros.slice(2)}`;
  if (numeros.length <= 8) {
    return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5)}`;
  }
  if (numeros.length <= 12) {
    return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}/${numeros.slice(8)}`;
  }
  return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}/${numeros.slice(8, 12)}-${numeros.slice(12)}`;
}

function App() {
  const [etapa, setEtapa] = useState('consulta'); // 'consulta' | 'validacao'
  const [telefone, setTelefone] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [resgatarPontos, setResgatarPontos] = useState(true);
  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleConsultar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setErro('');
    const resposta = await enviarCodigo(telefone, cnpj);
    setEnviando(false);
    if (resposta.sucesso) {
      setEtapa('validacao');
    } else {
      setErro('Não foi possível enviar o SMS. Tente novamente.');
    }
  };

  const handleValidar = async (e) => {
    e.preventDefault();
    setErro('');
    const resposta = await verificarCodigo(telefone, codigo);
    if (resposta.sucesso) {
      // aqui depois entra o redirecionamento pro painel
      alert('Código validado com sucesso!');
    } else {
      setErro('Código inválido, tente novamente.');
    }
  };

  return (
    <div className="pagina-pontos">
      <header className="hero">
        <div className="hero-top">
          <img src={logo} alt="Hanover e Tavares Imoveis" className="logo-espaco" />
          <div className="badge-pill">
            <span className="badge-dash" />
            <span className="badge-dot" />
            <span className="badge-dot" />
          </div>
        </div>
        <div className="divisor" />
        <h1>HANOVER TAVARES</h1>
        <p>
          {etapa === 'consulta'
            ? 'Verifique propostas personalizadas, e de seu interesse preenchendo nosso formulário.'
            : 'Confirme o código enviado para o seu celular'}
        </p>
      </header>

      <main className="area-card">
        {etapa === 'consulta' && (
          <form className="card-consulta" onSubmit={handleConsultar}>
            <div className="barra-destaque" />

            <label htmlFor="telefone">TELEFONE</label>
            <input
              id="telefone"
              type="tel"
              placeholder="(00) 00000-0000"
              value={telefone}
              onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
              required
            />

            <label htmlFor="cnpj">INFORME SEU CNPJ</label>
            <input
              id="cnpj"
              type="text"
              placeholder="00.000.000/0000-00"
              value={cnpj}
              onChange={(e) => setCnpj(formatarCnpj(e.target.value))}
              required
            />

            <div className="linha-toggle">
              <span>Já é nosso Cliente?</span>
              <button
                type="button"
                className={`toggle ${resgatarPontos ? 'ativo' : ''}`}
                onClick={() => setResgatarPontos(!resgatarPontos)}
                aria-pressed={resgatarPontos}
              >
                <span className="toggle-bolinha" />
              </button>
            </div>

            {erro && <p className="mensagem-erro">{erro}</p>}

            <button type="submit" className="botao-consultar" disabled={enviando}>
              {enviando ? 'Enviando...' : 'Verificar Propostas'}
              <span className="icone-seta">→</span>
            </button>
          </form>
        )}

        {etapa === 'validacao' && (
          <form className="card-consulta card-entrando" onSubmit={handleValidar}>
            <div className="barra-destaque" />

            <div className="aviso-sms">
              <span className="pulso">
                <span className="pulso-anel" />
                <span className="pulso-icone">✓</span>
              </span>
              <div>
                <strong>SMS enviado</strong>
                <p>Enviamos um código de verificação para <br /> {telefone || 'o seu celular'}</p>
              </div>
            </div>

            <label htmlFor="codigo">CÓDIGO DE VERIFICAÇÃO</label>
            <input
              id="codigo"
              type="text"
              placeholder="000000"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              maxLength={6}
              required
            />

            {erro && <p className="mensagem-erro">{erro}</p>}

            <button type="submit" className="botao-consultar">
              <span className="icone-seta">→</span>
              Validar Código
            </button>

            <button
              type="button"
              className="botao-voltar"
              onClick={() => setEtapa('consulta')}
            >
              Voltar
            </button>
          </form>
        )}

        <div className="ambiente-seguro">
          <span className="icone-escudo">🛡</span>
          AMBIENTE SEGURO | HANOVER IMOBILIÁRIA
          <span className="selo-espaco">{/* selo/logo cinza entra aqui */}</span>
        </div>
      </main>
    </div>
  );
}

export default App;