@component
export class Logger extends BaseScriptComponent {

    @input
    text:Text

    private static instance: Logger;

    private constructor(){
        super();
    }

    public static getInstance():Logger{
        if(!Logger.instance){
            throw new Error("Trying to get Logger instance, but it hasn't been set.  You need to call it later.");
        }
        return Logger.instance;
    }

    onAwake() {
        if(!Logger.instance){
            Logger.instance = this;
        }else{
            throw new Error("Logger already has an instance.  Aborting.")
        }
    }

    public log(msg:string){
        print(msg);
        this.text.text = msg;
    }
}