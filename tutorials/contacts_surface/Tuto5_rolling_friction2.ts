class Tuto5_rolling_friction2 {

    private energy: Energy;   
    private spheres_rho_rho2: Array<BABYLON.Mesh> = new Array<BABYLON.Mesh>();
    private spheres_rhoN: Array<BABYLON.Mesh> = new Array<BABYLON.Mesh>();
    private spheres_mu: Array<BABYLON.Mesh> = new Array<BABYLON.Mesh>();

    /**
    * @
    * @rho: Rolling friction coefficient around direction 1.
    * @rho2: Rolling friction coefficient around direction 2.
    * @rhoN: Rolling friction coefficient around the normal direction.
    * @see Tuto4_rolling_friction for rho 2 N explanations
    * @in this example we set rho, rho2 and rhoN independately.
    * @rho rolling friction on x -x , rho2 rolling friction on y -y, rhoN rolling friction on z (spinning effect)
    * @important contact flag muste be set to  dContactApprox1 | dContactRolling | dContactAxisDep
    * @dContactAxisDep is the parameter to tell to the engine to take in account rho2 & rhoN
    */

    constructor(private scene: BABYLON.Scene) {

        //camera & keyhandler helper & screen info
        this.control();

        // defined contactflag mode This must always be set. This is a combination of one or more of the following see energy/TypeDef.ts (dContact...)

        // contactFlagMode is set to dContactMu2 to compute mu2 , mu parameter is compute by default
        var contactFlagMode = dContactApprox1 | dContactRolling | dContactAxisDep;

        //init physic engine in quickstemode (faster but less accurate)
        this.energy = new Energy(scene, new BABYLON.Vector3(0, -10, 0), Energy.QUICK_STEP, contactFlagMode, 1, 20);
        // normal step mode (more precise)
        //  this.energy = new Energy(scene, new BABYLON.Vector3(0, -9.8, 0),  Energy.NORMAL_STEP,contactFlagMode);
        this.energy.setTimeStepAndNumStep(0.030, 1);
        this.energy.setMaxContact(6);

        // add plane as ode geom // No babylon mesh is created here see tuto_addStaticPlane
        this.energy.addStaticPlane(0, 0, 1, 0);
        var materials: Materials = new Materials(scene);
        var n = 0;
        //spheres to demonstrate the use of rho and rho2
        for (var i = -7; i < 5; i = i + 2) {
            for (var j = -7; j < 5; j = j + 2) {                
                var sphere: BABYLON.Mesh = BABYLON.Mesh.CreateSphere("sp_rho_rho2", 16, 1, scene);
                if (j < -2) {
                    sphere.material = materials.matBlue;
                } else {
                    sphere.material = materials.matRed;
                }
                sphere.position = new BABYLON.Vector3(i, 0.5, j);
                this.spheres_rho_rho2.push(sphere);
                //add the boxes to the simulation - dynamicObjects are created with their own physic default material with the mu parameter(friction) at 0 -
                this.energy.addDynamicObject(sphere, Energy.SPHERE, 1);
                // we set  mu
                this.energy.dBodySetSurfaceParameter(this.spheres_rho_rho2[n], mu, 10);
                // set rho and rho2
                this.energy.dBodySetSurfaceParameter(this.spheres_rho_rho2[n], rho, 0.05);
                this.energy.dBodySetSurfaceParameter(this.spheres_rho_rho2[n], rho2, 0.25);
                n++
            }
        }
       
        n = 0;
         //spheres to demonstrate the use of rhoN
        for (var i =-5; i < 5; i = i + 2) {
            for (var j = -20; j < -10; j = j + 2) {                
                var sphere: BABYLON.Mesh = BABYLON.Mesh.CreateSphere("sp_rhoN", 16, 1, scene);
                sphere.material = materials.matGray;
                sphere.position = new BABYLON.Vector3(i, 0.5, j);
                this.spheres_rhoN.push(sphere);
                //add the spheres to the simulation - dynamicObjects are created with their own physic default material with the mu parameter(friction) at 0 -
                this.energy.addDynamicObject(sphere, Energy.SPHERE, 1);  

                // we set  mu
                this.energy.dBodySetSurfaceParameter(this.spheres_rhoN[n], mu, 10);              
                // rhoN values from 0 -> 1
                this.energy.dBodySetSurfaceParameter(this.spheres_rhoN[n], rhoN, n / (25));                
                n++;
            }
        }

        //spheres with only the parameter mu(standard friction),rho2=0 and rhoN=0....
        n = 0; 
        for (var i = 10; i < 20; i = i + 2) {
            for (var j = -20; j < -10; j = j + 2) {
                var sphere: BABYLON.Mesh = BABYLON.Mesh.CreateSphere("sp_mu", 16, 1, scene);
                sphere.material = materials.matGreen;
                sphere.position = new BABYLON.Vector3(i, 0.5, j);
                this.spheres_mu.push(sphere);
                //add the spheres to the simulation - dynamicObjects are created with their own physic default material with the mu parameter(friction) at 0 -
                this.energy.addDynamicObject(sphere, Energy.SPHERE, 1);

                // we set  mu only 
                this.energy.dBodySetSurfaceParameter(this.spheres_mu[n], mu, 10);
                this.energy.dBodySetSurfaceParameter(this.spheres_mu[n], rho, 0.0);
                this.energy.dBodySetSurfaceParameter(this.spheres_mu[n], rho2, 0.0);
                n++; 

            }
        }

        this.energy.startSimulation();
        
    }
    
    private key_up(event: any): void {

        var key = event.sourceEvent.key;

        switch (key) {
            case "s":
                var n = 0;
                // impulse on rho and rho2 sphere
                for (var i = 0; i < 12; i = i + 2) {
                    for (var j = 0; j < 12; j = j + 2) {
                        if (j < 5) {
                            this.energy.dBodyAddForce(this.spheres_rho_rho2[n], new BABYLON.Vector3(-250, 0, 0), false);
                          
                        } else {
                            this.energy.dBodyAddForce(this.spheres_rho_rho2[n], new BABYLON.Vector3(0, 0, 250), false);
                        }
                        n++;
                    }
                }

                // torque on rhoN to show spinning friction
                var n = 0;
                for (var i = -5; i < 5; i = i + 2) {
                    for (var j = -20; j < -10; j = j + 2) {
                        this.energy.dBodyAddTorque(this.spheres_rhoN[n], new BABYLON.Vector3(0,250, 0), false);
                        n++;
                    }
                }

                //impulse on spheres_mu only
                n = 0;
                for (var i = 10; i < 20; i = i + 2) {
                    for (var j = -20; j < -10; j = j + 2) {
                        this.energy.dBodyAddForce(this.spheres_mu[n], new BABYLON.Vector3(250, 0, 0), false);
                        n++;
                    }
                }

                break;
            case "r":
                var n = 0;
                //reset rho and rho2 sphere
                for (var i = -7; i < 5; i = i + 2) {
                    for (var j = -7; j < 5; j = j + 2) {
                        this.energy.dBodySetZeroForce(this.spheres_rho_rho2[n]);
                        this.energy.dBodySetPosition(this.spheres_rho_rho2[n], new BABYLON.Vector3(i, 0.5, j));
                        n++;
                    }
                }
                //reset rhonSpheres
                n = 0;
                for (var i = -5; i < 5; i = i + 2) {
                    for (var j = -20; j < -10; j = j + 2) {
                        this.energy.dBodySetZeroForce(this.spheres_rhoN[n]);
                        this.energy.dBodySetPosition(this.spheres_rhoN[n], new BABYLON.Vector3(i, 0.5, j));
                        n++;
                    }
                }

                //reset spheres_mu
                n = 0;
                for (var i = 10; i < 20; i = i + 2) {
                    for (var j = -20; j < -10; j = j + 2) {
                        this.energy.dBodySetZeroForce(this.spheres_mu[n]);
                        this.energy.dBodySetPosition(this.spheres_mu[n], new BABYLON.Vector3(i, 0.5, j));
                        n++;
                    }
                }

               
                break;

        }
    }

    private control(): void {

        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), this.scene);
        camera.setPosition(new BABYLON.Vector3(-25, 25, -25));
        camera.speed = 0.5;
        camera.maxZ = 2000;
        camera.inertia = 0.7;

        document.getElementById("control").innerHTML = "energy.js - Rolling Friction2 - (s) start - (r) reset <br><br>Green -> mu:10, rho &rho2 set to 0 <br>Red & Blue -> mu:10 rho:0.05 rolling friction on (-x,x),  rho2:0.25 r.f. (-y,y)<br> Gray -> mu:10 rhoN: 0->1";

        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, (evt) => this.key_up(evt)));

        // -x x helper
        var box: BABYLON.Mesh = BABYLON.Mesh.CreateBox("", 1, this.scene);
        box.position = new BABYLON.Vector3(-30, 0.5, 0);
        var box: BABYLON.Mesh = BABYLON.Mesh.CreateBox("", 4, this.scene);
        box.position = new BABYLON.Vector3(30, 0.5, 0);
    }



    




}