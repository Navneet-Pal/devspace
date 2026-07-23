
type BadgeProps = {
    children : React.ReactNode;
}

export default function Badge({children} : BadgeProps){
    return(
        <p className="border border-zinc-700 inline-flex rounded-full items-center px-4 py-2 text-sm font-medium">{children}</p>
    );
}