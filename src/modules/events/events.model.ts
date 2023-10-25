import { getModelForClass, prop } from "@typegoose/typegoose";

class EventClass {
    @prop({required: true, unique: true})
    public blockNo!: number;

    @prop({required: true}) //validate isAddress
    public token!: string;

    @prop({required: true, index: true})
    public integrator!: string;

    @prop()
    public integratorFee?: number;

    @prop({default: 0})
    public lifiFee?: number;
}

export default getModelForClass(EventClass);