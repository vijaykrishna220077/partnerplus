import React from 'react';
import { 
  Wrench, 
  Zap, 
  Hammer, 
  Paintbrush, 
  Sparkles, 
  Sprout, 
  Car, 
  HeartHandshake, 
  Tv, 
  Grid, 
  ShieldAlert, 
  Cpu, 
  HardHat, 
  CheckCircle2, 
  Star, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';

interface ServiceIconProps {
  name: string;
  className?: string;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({ name, className = 'w-6 h-6' }) => {
  switch (name) {
    case 'Wrench':
      return <Wrench className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Hammer':
      return <Hammer className={className} />;
    case 'Paintbrush':
      return <Paintbrush className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Sprout':
      return <Sprout className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'HeartHandshake':
      return <HeartHandshake className={className} />;
    case 'Tv':
      return <Tv className={className} />;
    case 'Grid':
      return <Grid className={className} />;
    case 'ShieldAlert':
      return <ShieldAlert className={className} />;
    case 'Cpu':
      return <Cpu className={className} />;
    default:
      return <HardHat className={className} />;
  }
};
