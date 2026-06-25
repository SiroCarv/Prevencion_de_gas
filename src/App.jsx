import { useState, useEffect } from 'react';

function App() {
  const [ipAddress, setIpAddress] = useState('');
  const [gasData, setGasData] = useState({ gas: 0, alerta: false });
  const [isConnected, setIsConnected] = useState(false);
  const [errorStatus, setErrorStatus] = useState('');

  // Efecto para consultar los datos repetitivamente cuando está conectado
  useEffect(() => {
    let intervalId;
    if (isConnected && ipAddress) {
      intervalId = setInterval(async () => {
        try {
          // Hacemos la petición HTTP al NodeMCU
          const response = await fetch(`http://${ipAddress}/data`);
          if (!response.ok) throw new Error('Error de red');
          
          const data = await response.json();
          setGasData(data);
          setErrorStatus(''); // Limpiamos errores si la conexión es exitosa
        } catch (error) {
          console.error("Fallo al obtener datos:", error);
          setErrorStatus('Conexión perdida con el sensor');
        }
      }, 500); // Consulta los datos cada medio segundo (500ms)
    }
    
    // Limpieza del intervalo
    return () => clearInterval(intervalId);
  }, [isConnected, ipAddress]);

  const handleConnect = (e) => {
    e.preventDefault();
    if (ipAddress.trim() !== '') {
      setIsConnected(true);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setGasData({ gas: 0, alerta: false });
    setErrorStatus('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">
          Monitor IoT de Gas
        </h1>
        <p className="text-slate-400 mb-10">Conexión Inalámbrica (Wi-Fi Local)</p>
        
        {!isConnected ? (
          <form onSubmit={handleConnect} className="bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md mx-auto">
            <label className="block text-left text-sm font-medium text-slate-300 mb-2">
              Dirección IP del NodeMCU:
            </label>
            <input 
              type="text" 
              placeholder="Ej: 192.168.43.50"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition-colors"
            >
              Conectar vía Wi-Fi
            </button>
          </form>
        ) : (
          <div className={`p-10 rounded-2xl shadow-2xl transition-all duration-500 relative ${gasData.alerta ? 'bg-red-600/20 border border-red-500' : 'bg-slate-800 border border-slate-700'}`}>
            
            <button 
              onClick={handleDisconnect}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-sm underline"
            >
              Desconectar
            </button>

            {errorStatus && (
              <div className="bg-orange-500/20 text-orange-400 text-sm font-bold py-2 mb-4 rounded border border-orange-500/50">
                {errorStatus}
              </div>
            )}

            <div className="mb-8 mt-4">
              <h2 className="text-sm uppercase tracking-widest text-slate-400 mb-2">Lectura del Sensor (MQ-2)</h2>
              <div className="text-7xl font-black font-mono">
                {gasData.gas}
                <span className="text-3xl text-slate-500 ml-2">/1023</span>
              </div>
            </div>
            
            <div className={`py-4 px-6 rounded-lg font-bold text-2xl uppercase tracking-wider ${gasData.alerta ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {gasData.alerta ? '¡Peligro: Fuga Detectada!' : 'Ambiente Seguro'}
            </div>

            {gasData.alerta && (
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm font-medium text-red-200">
                <div className="bg-red-900/50 py-3 rounded">Válvula: CERRADA (180°)</div>
                <div className="bg-red-900/50 py-3 rounded">Ventilación: ACTIVADA</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;