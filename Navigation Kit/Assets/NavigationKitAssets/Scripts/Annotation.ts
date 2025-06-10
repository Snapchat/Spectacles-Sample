/**
 * A simple class used to serialize annotations on the inspector window.
 */
@component
export class Annotation extends BaseScriptComponent {
    @input 
    @widget(new TextAreaWidget())
    private text: string

}
