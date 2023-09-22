import { Wood, defaultWood } from "./specification/wood";
import { Lid, defaultLid } from "./specification/lid";

/**
 * The main data model for a box.
 */
export class BoxPlan {

    private _boxName: string = "MyBox";
    private _wood: Wood = defaultWood;
    private _lid: Lid = defaultLid;

    private _maxDepth?: number;
    private _maxWidth?: number;
    private _maxLength?: number;

    private _maxWorkableDepth?: number;
    private _maxWorkableWidth?: number;
    private _maxWorkableLength?: number;

    private _actualDepth?: number;
    private _actualWidth?: number;
    private _actualLength?: number;

    private _actualWorkableDepth?: number;
    private _actualWorkableWidth?: number;
    private _actualWorkableLength?: number;

    getBoxName():string {return this._boxName};
    getWood():Wood {return this._wood};
    getLid():Lid {return this._lid};

    getMaxDepth():number | undefined {return this._maxDepth};
    getMaxWidth():number | undefined {return this._maxWidth};
    getMaxLength():number | undefined {return this._maxLength};

    getMaxWorkableDepth():number | undefined {return this._maxWorkableDepth};
    getMaxWorkableWidth():number | undefined {return this._maxWorkableWidth};
    getMaxWorkableLength():number | undefined {return this._maxWorkableLength};

    getActualDepth():number | undefined {return this._actualDepth};
    getActualWidth():number | undefined {return this._actualWidth};
    getActualLength():number | undefined {return this._actualLength};

    getActualWorkableDepth():number | undefined {return this._actualWorkableDepth};
    getActualWorkableWidth():number | undefined {return this._actualWorkableWidth};
    getActualWorkableLength():number | undefined {return this._actualWorkableLength};

    updateBoxName(boxName: string):void {
        this._boxName = boxName;
    }

    updateWood(wood: Wood):void {
        if(this._wood.size != wood.size){
            //TODO recalculate everything...
        }
        this._wood = wood;
    }

    updateLid(lid: Lid): void {
        //TODO recalculate
        this._lid = lid;
    }
}
