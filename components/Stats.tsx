import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { SKILLS } from '../constants';

const Stats: React.FC = () => {
  return (
    <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center relative">
       {/* HUD Decor */}
       <div className="absolute inset-0 border border-gray-800 rounded-full opacity-20 pointer-events-none"></div>
       <div className="absolute inset-[20%] border border-dashed border-gray-700 rounded-full opacity-20 pointer-events-none"></div>
       
       <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="60%" data={SKILLS}>
          <PolarGrid stroke="#1e293b" strokeWidth={1} />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Space Grotesk' }}
            angle={0}
            tickLine={false}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Meftun"
            dataKey="A"
            stroke="#06b6d4"
            strokeWidth={2}
            fill="#06b6d4"
            fillOpacity={0.2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Stats;