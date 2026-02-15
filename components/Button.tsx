import {ButtonHTMLAttributes, JSX} from "react";
import { cn } from "@/lib/utils";
import {LoaderCircle} from "lucide-react";

interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "destructive" | "text" | "icon" | "ghostIcon";
    size?: "xsm" | "sm" | "md" | "lg" | "smIcon" | "mdIcon";
    isLoading?: boolean;
}

const Button = ({
                    variant = "primary",
                    size = "md",
                    isLoading = false,
                    className,
                    children,
                    ...props
                }: BaseButtonProps): JSX.Element | null => {
    const baseClasses = `
        min-w-52
        flex items-center justify-center gap-2 
        rounded-lg
        transition duration-150 
        ring-0 ring-offset-2 ring-offset-background
        hover:ring-2 hover:ring-gray-400
        focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-background
    `;

    const variantClasses = {
        primary: "bg-black text-white",
        secondary: "bg-secondary text-gray-800 hover:ring-black focus:ring-black",
        outline: "border-2 border-foregroundMuted ring-transparent focus:ring-transparent hover:ring-transparent hover:bg-secondary focus:border-black focus:bg-secondary",
        destructive: "bg-white text-destructive hover:bg-destructive/10 hover:ring-2 hover:ring-destructive",
        text: "text-black ring-transparent focus:ring-transparent hover:ring-transparent duration-200 hover:bg-secondary focus:bg-secondary",
        icon: "bg-secondary",
        ghostIcon: "bg-transparent hover:ring-offset-transparent hover:bg-secondary focus:bg-secondary ring-transparent focus:ring-transparent hover:ring-transparent",
    };

    const sizeClasses = {
        xsm: "h-9 px-6 py-2.5 text-xs",
        sm: "h-11 px-6 py-2.5 text-sm",
        md: "h-12 px-8 py-3",
        lg: "h-14 px-6 py-3 text-lg",
        smIcon: "min-w-8 max-w-8 h-8 px-2",
        mdIcon: "min-w-12 max-w-9 h-12",
    };

    const isDisabled = isLoading || props.disabled;

    return (
        <button
            className={cn(
                baseClasses,
                variantClasses[variant] || variantClasses["primary"],
                sizeClasses[size] || sizeClasses["md"],
                className,
                isDisabled && "opacity-60 cursor-not-allowed"
            )}
            {...props}
            disabled={isDisabled}
            onClick={isDisabled ? undefined : props.onClick}
            style={{cursor: isDisabled ? "not-allowed" : "pointer"}}
        >
            {isLoading ? <LoaderCircle className={"animate-spin"}/> : children}
        </button>
    );
};

export default Button;


/*
    return (
        <button
            className="py-2 w-40 bg-black text-white rounded ring-transparent hover:ring-opacity-20 hover:ring-offset-2 hover:ring-black transition duration-100 ring-2"
            onClick={handleClick}
        >
            {isMenuVisible ? "Hide Menu" : "Les mer"}
        </button>
    );
*/
