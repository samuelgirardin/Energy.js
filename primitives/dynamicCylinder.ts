class DynamicCylinder extends DynamicObject {


    private radius:number; 
    private length: number;
    private direction: number;

  

    constructor(dxSpace: DxSpace, dxWorld: DxWorld, density: number,  radius: number, length: number, direction: number, uniqID: number, name: string = "") {

        super(); 
        this.dxWorld = dxWorld;
        this.density = density;
        this.dxSpace = dxSpace;
        this.density = density;
        this.dxBody = Energy.dBodyCreate(this.dxWorld);
        this.dxMass = EnergyTools.Malloc_dMass_Struct();
        this.uniqID = uniqID; 
        this.name = name;
         this.radius = radius;
        this.length = length;
        this.direction = direction;

         // we deal now for with dynamic object (geom+body) or static object (only geom) 
        this.dxGeom = Energy.dCreateCylinder(this.dxSpace, this.radius, this.length);  
        if (this.density != 0) { 
            Energy.dMassSetCylinder(this.dxMass, this.density, this.direction, this.radius, this.length);
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