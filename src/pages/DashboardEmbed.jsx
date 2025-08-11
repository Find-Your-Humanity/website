import React, { useEffect, useState } from 'react';

const DashboardEmbed = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{height: 'calc(100vh - 140px)', display:'flex', flexDirection:'column'}}>
      <div style={{height: 12}} />
      <div style={{position:'relative', flex:1, borderRadius: 12, overflow:'hidden', boxShadow:'0 8px 24px rgba(0,0,0,0.15)'}}>
        {isLoading && (
          <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg, rgba(138,43,226,0.08), rgba(32,223,223,0.08))'}}>
            <div className="spinner" />
          </div>
        )}
        <iframe
          title="Realcatcha Dashboard"
          src="https://dashboard.realcatcha.com"
          style={{ width: '100%', height: '100%', border: 'none', background:'#fff' }}
          onLoad={() => setIsLoading(false)}
        />
      </div>
      <div style={{height: 12}} />
    </div>
  );
};

export default DashboardEmbed;


