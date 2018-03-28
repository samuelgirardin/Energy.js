class Tuto4_rolling_friction {

    private energy: Energy;
    private positions: Array<BABYLON.Vector3> = new Array<BABYLON.Vector3>();
    private sphereGeom: Array<BABYLON.Mesh> = new Array<BABYLON.Mesh>();
   
    /**
    * @rolling friction  adds optional rolling and spinning drag to bodies through
    * @the contact joint. Using the dContactApprox1 flag makes the resistance proportional
    * @to the normal force.Different combinations of rolling and sliding friction make a ball
    * @on a ramp either slide down the ramp, roll down the ramp, or come to a stop
    * @
    * @3 parameters are available rho, rho2 and rhoN. rho & rho2 are similar as mu and mu2 (rolling 
    f @friction direction -x x -y y). rhoN deals with spinning friction.
    * @in this first case we use only the first parameter rho. rho2 & rhoN effect are computed using the rho value.
    * @You can look a Tuto5_rolling_frinction2 to see how to use rho, rho2,rhoN independetely.
    */
    constructor(private scene: BABYLON.Scene) {

        //camera & keyhandler helper & screen info
        this.control(); 

        // defined contactflag mode This must always be set. This is a combination of one or more of the following see energy/TypeDef.ts (dContact...)

        // contactFlagMode is set to dContactRolling & dContactApprox1 to compute rho 
        // rho: global rolling friction coefficient 
        
        var contactFlagMode = dContactApprox1 | dContactRolling ;

        //init physic engine in quickstemode (faster but less accurate)
        // this.energy = new Energy(scene, new BABYLON.Vector3(0, -10, 0), Energy.QUICK_STEP, contactFlagMode, 1, 20);
        // normal step mode (more precise)
        this.energy = new Energy(scene, new BABYLON.Vector3(0, -9.8, 0), Energy.NORMAL_STEP, contactFlagMode);
        this.energy.setTimeStepAndNumStep(0.030, 1);
        this.energy.setMaxContact(6);

        // add plane as ode geom // No babylon mesh is created here see tuto_addStaticPlane
        this.energy.addStaticPlane(0, 0, 1, 0);

        //build the scene : original code - Joseph Cooper       
        var RAMP_COUNT = 20;
        var rampX = 6.0;
        var rampY = 0.5;
        var rampZ = 0.05;
        var sphereRadius = 0.25;
        var maxRamp = Math.PI / 4.0 // Needs to be less than pi/2
        var rampInc = maxRamp / RAMP_COUNT;
        var rampGeom: Array<BABYLON.Mesh> = new Array<BABYLON.Mesh>();       
        var materials: Materials = new Materials(scene);

        for (var ii= 0; ii < RAMP_COUNT;ii++) {
           
            var angle = (ii + 1) * rampInc;
            var cosA = Math.cos(angle);
            var sinA = Math.sin(angle);
            var rampW = rampX / cosA; // Box width that preserves ground distance
            var zPos = (0.5) * (sinA * rampW - cosA * rampZ); // Position that makes end meet ground
            var yPos = ii * 1.25 * rampY;
            var xPos = 0;

            // Create the ramp
            rampGeom[ii] = BABYLON.Mesh.CreateBox("", 1, this.scene);           
            rampGeom[ii].scaling = new BABYLON.Vector3( rampW, rampZ, rampY);           
            rampGeom[ii].rotation.z = angle;          
            rampGeom[ii].position = new BABYLON.Vector3(xPos, zPos, yPos);            
            this.energy.addDynamicObject(rampGeom[ii], Energy.BOX, 0);
            xPos = -0.5 * rampX + sphereRadius;
            zPos = sinA * rampW + sphereRadius;
            
            // Create Spheres
            this.sphereGeom[ii] = BABYLON.Mesh.CreateSphere("sp "+ii, 16, sphereRadius * 2, this.scene);
            this.sphereGeom[ii].material = materials.matBlue;
            this.sphereGeom[ii].position = new BABYLON.Vector3(-xPos, zPos, yPos);
            this.positions[ii] = new BABYLON.Vector3(-xPos, zPos, yPos);
          
            this.energy.addDynamicObject(this.sphereGeom[ii], Energy.SPHERE, 1)

            //mu & rho parameter are assignes in the switchcase in key_up method.
           
          
        }


      

    }

    private key_up(event: any): void {

        var key = event.sourceEvent.key;

        console.log(event);

        switch (key) {
            case "a":
                //with rolling friction
                for (var i = 0; i < this.sphereGeom.length; i++) {
                    this.energy.dBodySetSurfaceParameter(this.sphereGeom[i], mu, 1);
                    this.energy.dBodySetSurfaceParameter(this.sphereGeom[i], rho, 0.05);                   
                }
                this.energy.startSimulation();
                break;
            case "b":
                //WITHOUT rolling friction
                for (var i = 0; i < this.sphereGeom.length; i++) {
                    this.energy.dBodySetSurfaceParameter(this.sphereGeom[i], mu, 1);
                    this.energy.dBodySetSurfaceParameter(this.sphereGeom[i], rho, 0.0);                   
                }
                this.energy.startSimulation();
                break;
            case "r":
                for (var i = 0; i < this.sphereGeom.length; i++) {
                    this.energy.dBodySetZeroForce(this.sphereGeom[i]);
                    this.energy.dBodySetPosition(this.sphereGeom[i], this.positions[i]);                  
                }
                this.energy.pauseSimulation();
                // just top update one step as the simulation is paused , to get the sphere a their ini positions
                this.energy.simloop();
               
                break;
        }
    }

    private control(): void {

        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 7), this.scene);
        camera.setPosition(new BABYLON.Vector3(-10, 10, -10));
        camera.speed = 0.5;
        camera.maxZ = 2000;
        camera.inertia = 0.7;

        document.getElementById("control").innerHTML = "energy.js - Rolling Friction rho<br> (a) start with rolling friction, mu:1 & rho:0.05 <br>  (b) start with NO rolling friction set mu:1 & rho:0 <br> (r) reset";

        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, (evt) => this.key_up(evt)));
    }

}