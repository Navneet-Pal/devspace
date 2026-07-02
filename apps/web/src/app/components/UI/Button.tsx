
type ButtonProps = {
    children : React.ReactNode;
    variant : "primary" | "secondary";
};

export default function Button({
    children,variant = "primary" } : ButtonProps ){

        const baseClass = "inline-flex cursor-pointer items-center justify-center h-10 rounded-2xl px-8 py-2.5 text-sm font-medium transition-all duration-200" 
    
        const variants = {
            primary : "bg-white text-black hover:bg-zinc-200",
            secondary : "border border-zinc-700 text-white hover:bg-zinc-900"
        }
    return(
        <button className={`${baseClass} ${variants[variant]} `}>
            {children}
        </button>
    );
}