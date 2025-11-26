declare function input(typeOverride?: string, defaultInitializerOverride?: string): (target: undefined, context: ClassFieldDecoratorContext) => void;
declare function input(target: undefined, context: ClassFieldDecoratorContext): void;
declare function typename(target: undefined, context: ClassFieldDecoratorContext): void;
declare function hint(hint: string): (target: undefined, context: ClassFieldDecoratorContext) => void;
declare function label(label: string): (target: undefined, context: ClassFieldDecoratorContext) => void;
declare function showIf(showIf: string, showIfValue?: boolean | number | string): (target: undefined, context: ClassFieldDecoratorContext) => void;
declare function widget(uiWidget: UIWidget): (target: undefined, context: ClassFieldDecoratorContext) => void;
declare namespace ui {
    function separator(target: undefined, context: ClassFieldDecoratorContext): void;
    function separator(target: Function, context: ClassMethodDecoratorContext): void;
    function label(label: string): ((target: any, context: ClassFieldDecoratorContext | ClassMethodDecoratorContext) => void);
    function group_start(label: string): ((target: any, context: ClassFieldDecoratorContext | ClassMethodDecoratorContext) => void);
    function group_end(target: undefined, context: ClassFieldDecoratorContext): void;
    function group_end(target: Function, context: ClassMethodDecoratorContext): void;
}
declare function allowUndefined(target: undefined, context: ClassFieldDecoratorContext): void;
declare function component<T extends typeof BaseScriptComponent>(target: T, context: ClassDecoratorContext<T>): void;
declare function typedef<T extends new (...args: any[]) => {}>(target: T, context: ClassDecoratorContext<T>): void;
