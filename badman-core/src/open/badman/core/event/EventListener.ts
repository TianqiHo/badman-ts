

import EventObject from "./EventObject";
import EventListenerContext from "./EventListenerContext";
import Order from "../Order";


export default interface EventListener<SourceType,Event extends EventObject<SourceType>> extends Order{

    onValidate(e:Event):boolean;

    onAction(e:Event,context:EventListenerContext):Promise<any>;

    supportEventType(e:Event):boolean;

}