class PhysicMaterial {

    public dxMaterial: DxMaterial;  
    public name: string;


    /*public mu: number;
    public mu2: number;
    public bounce: number;
    public bounce_vel: number;
    public soft_erp: number;
    public soft_cfm: number;
    public rho: number;
    public rho2: number;
    public rhoN: number;
    public motion1: number;
    public publicmotion2: number;
    public motionN: number;
    public slip1: number;
    public slip2: number;*/

    static DefaultMaterial: PhysicMaterial = null;   
    public static Instances: Array<PhysicMaterial> = new Array<PhysicMaterial>();        


    constructor(name: string/*, world: DxWorld*/) {
        
        this.name = name;  
        this.dxMaterial = Energy.dMaterialCreate(0); 
        PhysicMaterial.Instances.push(this); 
       
    }

    public setMaterialParameter(param: number, value: number) {
       
        Energy.dMaterialSetParameter(this.dxMaterial, param, value); 
    }

    public getMaterialParameter(param: number):number {
       
       return  Energy.dMaterialGetParameter(this.dxMaterial, param); 
    }

    static GetDefault(): PhysicMaterial {


      //  console.log("getdef"); 
        
            PhysicMaterial.DefaultMaterial = new PhysicMaterial('defaultPhysicMaterial');
       //    PhysicMaterial.DefaultMaterial.setMaterialParameter(mu, 100000);   
          //  PhysicMaterial.DefaultMaterial.setMaterialParameter(mu2, 0);   
          //  PhysicMaterial.DefaultMaterial.setMaterialParameter(bounce, 0);   
          //  PhysicMaterial.DefaultMaterial.setMaterialParameter(bounce_vel, 0);
           // PhysicMaterial.DefaultMaterial.setMaterialParameter(soft_erp, 1);
            
                // dinfinity for strong friction // 0 for iceskating  MU parameter    
          
       


        return PhysicMaterial.DefaultMaterial; 

    }

}