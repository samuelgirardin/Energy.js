
// Created samuel girardin @samuelgirardin - 2018
// License Creative Commons Attribution-NonCommercial-ShareAlike 4.0 Unported License.
class DynamicSphere extends DynamicObject {

    private radius: number = 0;

  
    constructor(dxSpace: DxSpace, dxWorld: DxWorld, density: number,  radius: number,uniqID:number,name:string="") {

        super();
       
        this.dxWorld = dxWorld;
        this.density = density;
        this.dxSpace = dxSpace;      
        this.uniqID = uniqID; 
        this.radius = radius;
        this.name = name;
        
         // we deal now for with dynamic object (geom+body) or static object (only geom) 
        this.dxGeom = Energy.dCreateSphere(this.dxSpace, this.radius); 
        if (density != 0) {
            this.dxBody = Energy.dBodyCreate(this.dxWorld);
            this.dxMass = EnergyTools.Malloc_dMass_Struct();
            Energy.dMassSetSphere(this.dxMass, this.density, this.radius);
            Energy.dMassAdjust(this.dxMass, this.density);
            Energy.dBodySetMass(this.dxBody, this.dxMass);
            Energy.dGeomSetBody(this.dxGeom, this.dxBody);
            this.pointer_pos = Energy.dBodyGetPosition(this.dxBody);
            this.pointer_rot = Energy.dBodyGetQuaternion(this.dxBody);
           // EnergyTools.Free_dMass_Struc();
        } else {

            this.pointer_pos = Energy.dGeomGetPosition(this.dxGeom);
            this.pointer_rot = EnergyTools.Malloc_new_quaternion();
            Energy.dGeomGetQuaternion(this.dxGeom, this.pointer_rot);  

        }

        // assign the default material              
        this.dGeomSetMaterial(PhysicMaterial.GetDefault());
     

        DynamicObject.Instances.push(this); 
      
        
    }

}
