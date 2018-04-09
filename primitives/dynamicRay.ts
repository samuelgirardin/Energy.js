
// Created samuel girardin @samuelgirardin - 2018
// License Creative Commons Attribution-NonCommercial-ShareAlike 4.0 Unported License.
class DynamicRay extends DynamicObject {

    public dxSpace: DxSpace;
    public dxGeom: DxGeom;
    private length: number;

    static Instances: Array<DynamicRay> = new Array<DynamicRay>();

    constructor(dxSpace: DxSpace, length: number) {

        super(); 
        this.dxSpace = dxSpace;
        this.length = length;
        this.dxGeom = Energy.dCreateRay(this.dxSpace, this.length);
        console.log("ray", this.dxGeom)
        this.setRay(0, 10, 0, 0, -10, 0); 

        DynamicObject.Instances.push(this);
    }

    public setRay(px: number, py: number, pz: number, dx: number, dy: number, dz: number) {

        Energy.dGeomRaySet(this.dxGeom, px, pz, py, dx, dz, dy); 
    }

}