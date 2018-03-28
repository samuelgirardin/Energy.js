class StaticPlane {

    public dxGeom: DxGeom; 


/**
* Create a plane geom of the given parameters, and return its ID. If space is nonzero, insert it into that space. The plane equation is
* a*x+b*y+c*z = d The plane's normal vector is (a,b,c), and it must have length 1. Planes are non-placeable geoms. This means that, unlike 
* placeable geoms, planes do not have an assigned position and rotation. This means that the parameters (a,b,c,d) are always in global coordinates.
*  In other words it is assumed that the plane is always part of the static environment and not tied to any movable object.
*/ 
    constructor(dxSpace : DxSpace,a: number, b: number, c: number, d: number) { 
          
        this.dxGeom = Energy.dCreatePlane(dxSpace, a, b, c, d);
        Energy.dGeomSetMaterial(this.dxGeom, PhysicMaterial.GetDefault().dxMaterial); 
               

    }

    public getDxGeom(): DxGeom {
        return this.dxGeom;
    }

}