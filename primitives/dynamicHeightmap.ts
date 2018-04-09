
// Created samuel girardin @samuelgirardin - 2018
// License Creative Commons Attribution-NonCommercial-ShareAlike 4.0 Unported License.
class DynamicHeightmap extends DynamicObject {

   // private heightid: Pointer;
    private dxHeightfieldData: DxHeightfieldData; 

    constructor(dxSpace: DxSpace, dxWorld: DxWorld,heightData: Float64Array, width: number, depth: number, widthSamples: number, depthSamples: number, scale: number, offset: number, thickness: number, bWrap: number,uniqID : number,name:string="") { 
      
        super();        

        this.dxWorld = dxWorld;      
        this.dxSpace = dxSpace;
        this.uniqID = uniqID;
        this.name = name;

        //malloc float32array height data, warning we can t free this one      
        var pHeightData: number = EnergyTools.Malloc_Float64Array(heightData);
      
        this.dxHeightfieldData = Energy.dGeomHeightfieldDataCreate();

        Energy.dGeomHeightfieldDataBuildDouble(this.dxHeightfieldData, pHeightData, 0,  width, depth, widthSamples+1, depthSamples+1, scale, offset, thickness, bWrap);                                                  

        Energy.dGeomHeightfieldDataSetBounds(this.dxHeightfieldData, -30, 30);
        this.dxGeom = Energy.dCreateHeightfield(this.dxSpace, this.dxHeightfieldData, 1);      

       
        this.pointer_pos = Energy.dGeomGetPosition(this.dxGeom);
        this.pointer_rot = EnergyTools.Malloc_new_quaternion();
        Energy.dGeomGetQuaternion(this.dxGeom, this.pointer_rot);  

        // assign the default material 
        this.dGeomSetMaterial(PhysicMaterial.GetDefault());
       
        DynamicObject.Instances.push(this); 
    }

}