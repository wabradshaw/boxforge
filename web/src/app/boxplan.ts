import { Journey } from "./journey/journey";

import { Wood, defaultWood } from "./specification/wood";
import { Lid, defaultLid } from "./specification/lid";

/**
 * The main data model for a box.
 */
export class BoxPlan {

    readonly journey = new Journey();

    private _defaultBoxName = "MyBox";
    private _boxName: string = this._defaultBoxName;
    private _wood: Wood = defaultWood;
    private _lid: Lid = defaultLid;

    private _targetDepth?: number;
    private _targetWidth?: number;
    private _targetLength?: number;

    private _targetWorkableDepth?: number;
    private _targetWorkableWidth?: number;
    private _targetWorkableLength?: number;

    private _actualDepth?: number;
    private _actualWidth?: number;
    private _actualLength?: number;

    private _actualWorkableDepth?: number;
    private _actualWorkableWidth?: number;
    private _actualWorkableLength?: number;

    getBoxName():string {return this._boxName};
    getWood():Wood {return this._wood};
    getLid():Lid {return this._lid};

    // Users set the target workable depth, but the target overall box size.
    getTargetWorkableDepth():number | undefined {return this._targetWorkableDepth};
    getTargetWidth():number | undefined {return this._targetWidth};
    getTargetLength():number | undefined {return this._targetLength};

    getTargetDepth():number | undefined {return this._targetDepth};    
    getTargetWorkableWidth():number | undefined {return this._targetWorkableWidth};
    getTargetWorkableLength():number | undefined {return this._targetWorkableLength};

    getActualDepth():number | undefined {return this._actualDepth};
    getActualWidth():number | undefined {return this._actualWidth};
    getActualLength():number | undefined {return this._actualLength};

    getActualWorkableDepth():number | undefined {return this._actualWorkableDepth};
    getActualWorkableWidth():number | undefined {return this._actualWorkableWidth};
    getActualWorkableLength():number | undefined {return this._actualWorkableLength};
    
    updateBoxName(boxName: string):void {
        if(boxName.trim().length == 0) {
            this._boxName = this._defaultBoxName;
        } else {
            this._boxName = boxName;
        }
    }

    updateWood(wood: Wood):void {
        if(this._wood.size != wood.size){
            this._recalculateTargetDimensions();        
            //TODO recalculate everything...
        }
        this._wood = wood;
    }

    updateLid(lid: Lid): void {
        //TODO recalculate
        this._lid = lid;
        this._recalculateTargetDimensions();        
    }

    updateTargetWorkableDepth(depth: number): void {
        this._targetWorkableDepth = depth;        
        this._recalculateTargetDimensions();
        this.journey.compartmentDesign.state = 'available';        
    }

    getTargetDepthDifference(): number {
        let woodWidth = this._wood.size;
        let lidHeightFunction = this._lid.depthChange;
        return woodWidth + lidHeightFunction(woodWidth)
    }

    private _recalculateTargetDimensions() {
        let woodWidth = this._wood.size;

        if(this._targetWorkableDepth){
            this._targetDepth = this._targetWorkableDepth + this.getTargetDepthDifference();
        }
        if(this._targetWidth){
            this._targetWorkableWidth = this._targetWidth - this._lid.widthChange(woodWidth);
        }
        if(this._targetLength){
            this._targetDepth = this._targetLength - this._lid.lengthChange(woodWidth);
        }
    }
}
