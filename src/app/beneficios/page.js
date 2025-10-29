'use client';

import Image from 'next/image';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function BeneficiosPage() {
  const benefitsRef = useScrollAnimation({ stagger: 0.1 });

  const benefits = [
    { icon: '✨', title: 'Clase Muestra GRATIS', description: 'Prueba CrossFit y Funcional sin costo antes de comprometerte' },
    { icon: '👥', title: 'Planes en Pareja y Grupo', description: 'Descuentos especiales para parejas ($800 c/u) y grupos de 3-6 personas ($750 c/u)' },
    { icon: '🏋️', title: 'Equipamiento Completo', description: 'Barra olímpica, mancuernas, cuerdas, remadora, bicicleta y más' },
    { icon: '�‍🏫', title: 'Coaches Certificados', description: 'Entrenadores apasionados y capacitados para todos los niveles' },
    { icon: '🎯', title: 'Zona de Programación', description: 'Espacio exclusivo incluido en membresías CrossFit y Funcional' },
    { icon: '�', title: 'Flexibilidad de Horarios', description: 'Múltiples horarios disponibles que se adaptan a tu rutina' },
    { icon: '🧘', title: 'Variedad de Disciplinas', description: 'CrossFit, Funcional, Halterofilia, Cycling, Zumba, Baile y más' },
    { icon: '�', title: 'Clases para Niños', description: 'Funcional Kids para niños de 6-11 años con enfoque lúdico' },
    { icon: '💪', title: 'Todos los Niveles', description: 'Desde principiantes hasta atletas avanzados, todos son bienvenidos' },
    { icon: '🎉', title: 'Ambiente Familiar', description: 'Más que un gimnasio, una comunidad que te apoya y motiva' },
    { icon: '�', title: 'Clases Especializadas', description: 'Indoor Cycling con música y luces, Salsa, Cumbia y Flexibilidad' },
    { icon: '🏆', title: 'Preparación Competitiva', description: 'Paquete AVC Competición para atletas que buscan competir' },
    { icon: '💰', title: 'Promociones Especiales', description: 'Cycling: 10 clases x $750 (recibes 12) | Zumba: 2x1 este mes' },
    { icon: '📱', title: 'Reservación Fácil', description: 'Sistema de reservación por mensaje para clases con cupo limitado' },
    { icon: '�', title: 'Sin Experiencia Necesaria', description: 'Todo se adapta a tu nivel, aprende desde cero con seguridad' },
    { icon: '⚡', title: 'Resultados Reales', description: 'Aumenta masa muscular, mejora resistencia y composición corporal' },
  ];

  return (
    <>
      <section className="relative h-[60vh] flex items-center justify-center text-center px-4 pt-16">
        <div className="absolute inset-0">
          <Image
            src="https://placehold.co/1920x600/dc2626/333333?text=Beneficios+AVC"
            alt="Beneficios"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
            Beneficios de ser <span className="text-avc-red">miembro</span>
          </h1>
          <p className="text-xl text-gray-200">
            Todo lo que obtienes al unirte a la familia AVC Fitness Center
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div ref={benefitsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                data-animate
                className="bg-gray-800 p-6 rounded-xl text-center hover:bg-gray-750 transition duration-300 border-b-4 border-avc-red"
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
