import { motion } from 'framer-motion';


// Reusable floating element component
const FloatingElement = ({
    children,
    className = "",
    animationDuration = 3,
    delay = 0,
    yRange = [-20, 0],
    opacityRange = [0.3, 0.8]
}: {
    children: React.ReactNode;
    className?: string;
    animationDuration?: number;
    delay?: number;
    yRange?: [number, number];
    opacityRange?: [number, number];
}) => (
    <div className={`fixed pointer-events-none ${className}`}>
        <motion.div
            className="w-full h-full"
            animate={{
                y: [yRange[1], yRange[0], yRange[1]],
                opacity: [opacityRange[0], opacityRange[1], opacityRange[0]]
            }}
            transition={{
                duration: animationDuration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay
            }}
        >
            {children}
        </motion.div>
    </div>
);

// Reusable floating Nouns logo component for background
const FloatingNouns = ({
    className = "",
    duration = 8,
    direction = 1,
    delay = 0
}: {
    className?: string;
    duration?: number;
    direction?: number;
    delay?: number;
}) => (
    <div className={`fixed pointer-events-none z-0 ${className}`}>
        <motion.img
            src="/assets/db996353-1fad-4686-b3b5-bbc57e4b14a3_1500x500-removebg-preview.png"
            alt="Background Nouns"
            className="w-16 h-16 object-contain opacity-20 dark:opacity-15"
            animate={{
                rotate: direction * 360,
                y: [-15, 15, -15],
                opacity: [0.15, 0.25, 0.15]
            }}
            transition={{
                rotate: {
                    duration: duration,
                    repeat: Infinity,
                    ease: "linear"
                },
                y: {
                    duration: duration * 0.75,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay
                },
                opacity: {
                    duration: duration * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay
                }
            }}
        />
    </div>
);

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-nouns-bg dark:bg-dark-bg flex items-center justify-center px-4 pt-20 relative overflow-hidden">
            {/* Background floating elements */}
            <div className="absolute inset-0 z-0">
                {/* Floating Nouns Logos Background - All same size with opaque effect */}
                <FloatingNouns
                    className="top-1/4 left-1/4"
                    duration={8}
                    direction={1}
                    delay={0}
                />

                <FloatingNouns
                    className="bottom-1/4 right-1/4"
                    duration={6}
                    direction={-1}
                    delay={0.5}
                />

                <FloatingNouns
                    className="top-1/2 left-12"
                    duration={10}
                    direction={1}
                    delay={1}
                />

                <FloatingNouns
                    className="top-20 right-1/3"
                    duration={7}
                    direction={-1}
                    delay={1.5}
                />

                <FloatingNouns
                    className="bottom-1/3 left-1/2"
                    duration={9}
                    direction={1}
                    delay={2}
                />

                <FloatingNouns
                    className="top-1/3 right-12"
                    duration={5}
                    direction={-1}
                    delay={2.5}
                />

                <FloatingNouns
                    className="bottom-40 right-1/3"
                    duration={11}
                    direction={1}
                    delay={3}
                />

                <FloatingNouns
                    className="top-2/3 left-20"
                    duration={6.5}
                    direction={-1}
                    delay={3.5}
                />

                <FloatingNouns
                    className="top-1/6 left-1/2"
                    duration={8.5}
                    direction={1}
                    delay={4}
                />

                <FloatingNouns
                    className="bottom-1/6 right-1/6"
                    duration={7.5}
                    direction={-1}
                    delay={4.5}
                />

                <FloatingNouns
                    className="top-3/4 right-2/3"
                    duration={9.5}
                    direction={1}
                    delay={0.3}
                />

                <FloatingNouns
                    className="bottom-1/2 left-1/6"
                    duration={6.8}
                    direction={-1}
                    delay={1.2}
                />

                <FloatingNouns
                    className="top-1/5 right-1/5"
                    duration={8.2}
                    direction={1}
                    delay={2.8}
                />

                <FloatingNouns
                    className="bottom-2/3 right-1/2"
                    duration={7.8}
                    direction={-1}
                    delay={3.8}
                />

                <FloatingNouns
                    className="top-4/5 left-1/3"
                    duration={9.2}
                    direction={1}
                    delay={1.8}
                />

                {/* Decorative floating color elements */}
                <FloatingElement
                    className="top-20 left-10 w-12 h-12"
                    animationDuration={4}
                    yRange={[-15, 0]}
                    opacityRange={[0.1, 0.3]}
                >
                    <div className="w-full h-full bg-nouns-blue/20 dark:bg-nouns-blue/30 rounded-full" />
                </FloatingElement>

                <FloatingElement
                    className="bottom-32 right-16 w-10 h-10"
                    animationDuration={3.5}
                    delay={0.8}
                    yRange={[-12, 0]}
                    opacityRange={[0.1, 0.3]}
                >
                    <div className="w-full h-full bg-nouns-green/20 dark:bg-nouns-green/30 rounded-full" />
                </FloatingElement>

                <FloatingElement
                    className="top-40 right-20 w-8 h-8"
                    animationDuration={3}
                    delay={1.2}
                    yRange={[-10, 0]}
                    opacityRange={[0.1, 0.3]}
                >
                    <div className="w-full h-full bg-nouns-red/20 dark:bg-nouns-red/30 rounded-full" />
                </FloatingElement>

                <FloatingElement
                    className="bottom-20 left-1/4 w-6 h-6"
                    animationDuration={4.5}
                    delay={2}
                    yRange={[-8, 0]}
                    opacityRange={[0.1, 0.3]}
                >
                    <div className="w-full h-full bg-nouns-blue/15 dark:bg-nouns-blue/25 rounded-full" />
                </FloatingElement>
            </div>

            {/* Main content - stays above background */}
            <div className="text-center max-w-2xl mx-auto relative z-20">{/* ...existing code... */}
                {/* Animated 404 Title */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <h1 className="font-londrina text-8xl sm:text-9xl lg:text-[12rem] font-black text-nouns-red dark:text-nouns-red/90 leading-none">
                        404
                    </h1>
                </motion.div>

                {/* Rotating Nouns Logo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-8 flex justify-center"
                >
                    <motion.img
                        src="/assets/db996353-1fad-4686-b3b5-bbc57e4b14a3_1500x500-removebg-preview.png"
                        alt="Lost Nouns Logo"
                        className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 object-contain"
                        animate={{
                            rotate: 360
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </motion.div>

                {/* Caption */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mb-12"
                >
                    <h2 className="font-londrina text-2xl sm:text-3xl lg:text-4xl font-bold text-nouns-text dark:text-dark-text mb-4">
                        PAGE NOT FOUND
                    </h2>
                    <p className="font-londrina text-lg sm:text-xl lg:text-2xl text-nouns-dark-grey dark:text-dark-muted leading-relaxed max-w-lg mx-auto">
                        These noggles are going in circles, just like us trying to find that page
                    </p>
                </motion.div>


            </div>
        </div>
    );
};

export default NotFoundPage;
