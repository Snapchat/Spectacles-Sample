declare class UIControl {
    protected label: string;
    protected hint: string;
    protected showIf: string;
    protected showIfValue: string | number | boolean;
    protected widget: UIWidget;
    constructor();
    addLabel(label: string): this;
    addHint(hint: string): this;
    addShowIf(showIf: string, showIfValue?: string | number | boolean): this;
    addWidget(widget: UIWidget): this;
    getShowIf(): string;
    getShowIfValue(): string | number | boolean;
    toString(): string;
}
declare abstract class UIWidget {
    private __uiWidget: void;
    abstract toString(): string;
}
declare class ColorWidget extends UIWidget {
    toString(): string;
}
declare class ComboBoxWidget extends UIWidget {
    protected items: ComboBoxItem[];
    constructor(items?: ComboBoxItem[]);
    addItem(label: string, value?: string | number): this;
    toString(): string;
}
declare class ComboBoxItem {
    protected label: string;
    protected value: string | number;
    constructor(label: string, value?: string | number);
    toString(): string;
}
declare class TextAreaWidget extends UIWidget {
    toString(): string;
}
declare class SpinBoxWidget extends UIWidget {
    protected min?: number;
    protected max?: number;
    protected step?: number;
    constructor(min?: number, max?: number, step?: number);
    setMin(min: number): SpinBoxWidget;
    setMax(max: number): SpinBoxWidget;
    setStep(step: number): SpinBoxWidget;
    toString(): string;
}
declare class SliderWidget extends UIWidget {
    protected min: number;
    protected max: number;
    protected step?: number;
    constructor(min: number, max: number, step?: number);
    toString(): string;
}
