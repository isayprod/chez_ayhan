import { CheckIcon, TruckIcon, PackageIcon, UtensilsIcon, ClockIcon } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Types de statuts de commande possibles
 */
export type OrderStatus = 
  | 'en_attente_de_preparation'
  | 'en_preparation'
  | 'prete_a_etre_recuperee'
  | 'en_livraison'
  | 'livree';

/**
 * Configuration des étapes de statut avec leurs propriétés visuelles
 */
const getStatusSteps = (isDelivery: boolean) => {
  // Étapes communes pour tous les modes
  const baseSteps = [
    { 
      key: 'en_attente_de_preparation', 
      label: 'En attente', 
      color: 'bg-yellow-500',
      icon: ClockIcon
    },
    { 
      key: 'en_preparation', 
      label: 'En préparation', 
      color: 'bg-orange-500',
      icon: UtensilsIcon
    },
  ];
  
  // Ajouter les étapes de livraison uniquement si mode livraison
  if (isDelivery) {
    return [
      ...baseSteps,
      { 
        key: 'en_livraison', 
        label: 'En livraison', 
        color: 'bg-blue-500',
        icon: TruckIcon
      },
      { 
        key: 'livree', 
        label: 'Livrée', 
        color: 'bg-gray-500',
        icon: PackageIcon
      }
    ];
  }else {
    return [
      ...baseSteps,
      { 
        key: 'prete_a_etre_recuperee', 
        label: 'Prête', 
        color: 'bg-green-500',
        icon: CheckIcon
      }
    ]
  }
};

interface OrderStatusTrackerProps {
  status: OrderStatus;
  isDelivery?: boolean;
}

// Animations pour les icônes
const iconVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
};

/**
 * Composant qui affiche un tracker visuel de l'état d'une commande
 * Version desktop (horizontale) et mobile (verticale)
 */
export default function OrderStatusTracker({ status, isDelivery = true }: OrderStatusTrackerProps) {
  const statusSteps = getStatusSteps(isDelivery);
  
  // Trouver l'index du statut actuel
  const currentIndex = statusSteps.findIndex(step => step.key === status);
  
  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-medium">Statut de votre commande</h3>
      
      {/* Version Desktop - Horizontale */}
      <div className="hidden md:block relative pt-6">
        {/* Ligne de progression - Arrière-plan */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-200"></div>
        
        {/* Ligne de progression - Remplissage coloré */}
        <motion.div 
          className="absolute top-0 left-0 h-1" 
          initial={{ width: "0%" }}
          animate={{ 
            width: `${(currentIndex / (statusSteps.length - 1)) * 100}%`,
            backgroundColor: statusSteps[currentIndex]?.color.replace('bg-', '') || 'rgb(250 204 21)'
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        ></motion.div>
        
        {/* Étapes du processus */}
        <div className="relative flex justify-between">
          {statusSteps.map((step, index) => (
            <div key={step.key} className="flex flex-col items-center">
              <motion.div 
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all
                  ${index <= currentIndex ? step.color : 'bg-gray-200'}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: index === currentIndex ? 1.2 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {index < currentIndex ? (
                  <motion.div
                    initial="initial"
                    animate="animate"
                    variants={iconVariants}
                  >
                    <CheckIcon className="h-4 w-4 text-white" />
                  </motion.div>
                ) : index === currentIndex ? (
                  <motion.div
                    initial="initial"
                    animate="animate"
                    variants={iconVariants}
                    className="text-white"
                  >
                    <step.icon className="h-4 w-4 text-white" />
                  </motion.div>
                ) : null}
              </motion.div>
              <span className={`text-xs mt-2 text-center max-w-[80px] ${
                index === currentIndex ? 'font-semibold' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Version Mobile - Verticale */}
      <div className="md:hidden space-y-4 relative">
        {statusSteps.map((step, index) => (
          <motion.div 
            key={step.key} 
            className={`flex items-center space-x-3 ${
              index === currentIndex ? 'opacity-100' : 'opacity-70'
            }`}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <motion.div 
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0
                ${index <= currentIndex ? step.color : 'bg-gray-200'}`}
              initial={{ scale: 0.8 }}
              animate={{ scale: index === currentIndex ? 1.2 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {index < currentIndex ? (
                <motion.div
                  initial="initial"
                  animate="animate"
                  variants={iconVariants}
                >
                  <CheckIcon className="h-4 w-4 text-white" />
                </motion.div>
              ) : index === currentIndex ? (
                <motion.div
                  initial="initial"
                  animate="animate"
                  variants={iconVariants}
                  className="text-white"
                >
                  <step.icon className="h-4 w-4 text-white" />
                </motion.div>
              ) : null}
            </motion.div>
            <span className={`text-sm ${
              index === currentIndex ? 'font-semibold' : 'text-gray-700'
            }`}>
              {step.label}
            </span>
          </motion.div>
        ))}
        
        {/* Barre de progression verticale - Arrière-plan */}
        <div className="w-1 absolute h-[calc(100%-2rem)] left-4 top-12 bg-gray-200 -z-10"></div>
        
        {/* Barre de progression verticale - Remplissage coloré */}
        <motion.div 
          className="w-1 absolute top-12 left-4 -z-10"
          initial={{ height: "0%" }}
          animate={{ 
            height: `${(currentIndex / (statusSteps.length - 1)) * (100 - (16/(statusSteps.length)))}%`,
            backgroundColor: statusSteps[currentIndex]?.color.replace('bg-', '') || 'rgb(250 204 21)'
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        ></motion.div>
      </div>
    </div>
  );
} 