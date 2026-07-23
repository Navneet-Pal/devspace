
interface AuthDividerProps{
    text : string;
}


export default function AuthDivider({text = "OR"} : AuthDividerProps){

    return(
        <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border"/>

            <span className="text-sm font-medium text-muted-foreground">
                {text}
            </span>

            <div className="h-px flex-1 bg-border"/>
        </div>
    );
}