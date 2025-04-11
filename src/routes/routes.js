const { Router } = require("express");
const { PrismaClient } = require('@prisma/client');
const {generateRandomGadgetName, getRandomInt, isNumeric} = require('../utils/utils')

const router = Router();
const prisma = new PrismaClient();

router.get('/gadgets', async (req, res) => {
    try {
        let gadgets = await prisma.gadget.findMany()
        responseObjects = []
        gadgets.forEach(gadget => {
            let name = gadget.name
            let success = gadget.success
            let status = gadget.status
            responseObjects.push({"id": gadget.id,"gadget": `${name} ${success}% success probability. Status ${status}`})
        });
        res.json({"success": true, "data": responseObjects})
    } catch (err) {
        console.log(err)
        res.status(500).json({"success": false, "error": err})
    }
})

router.post('/gadgets', async (req, res) => {
    try {
        let randomName = generateRandomGadgetName()
        let success = getRandomInt()
        let gadget = await prisma.gadget.create({
            data: {
                name: randomName,
                success: success,
                status: "Available"
            }
        });
        res.status(201).json({success: true, message: gadget})
    } catch (err) {
        console.log("erroe")
        console.log(err);
        res.status(500).json({success: false, message: err});
    }
})

router.patch('/gadgets', async (req, res) => {
    try {
        const {name, status, success} = req.body
        console.log(name, status, success);
        if (name == null) {
            res.status(422).json({success: false, message: "name field is required"});
            return
        }
        if (typeof success === 'undefined' && typeof status === 'undefined') {
            res.status(400).json({success: false, message: "either success or status must be defined"});
            return
        }

        if (typeof status !== 'undefined') {
            if (!(status == "Available" || status == "Deployed" || status == "Destroyed" || status == "Decommissioned")) {
                res.status(400).json({success: false, message: "Status is an enum(Available, Deployed, Destroyed, Decommissioned)"});
                return
            }
        }
        if (typeof success !== 'undefined') {
            if (!(isNumeric(success))) {
                res.status(400).json({success: false, message: "success must be a number between 0-100"})
                return
            }
        }
        
        let data
        if (status != null) {
            data = {
                status: status
            }
        }
        if (success != null) {
            data = {
                success: parseInt(success)
            }
        }
        if (success != null && status != null) {
            data = {
                success: parseInt(success),
                status: status
            }
        }

        const update = await prisma.gadget.update({
            where: {
                name: name
            },
            data: data
        });
        res.status(201).json({success: true, message: update})
    } catch (err) {
        console.log(err);
        res.status(400).json({success: false, message: err});
    }
});

router.delete("/gadgets", async (req, res) => {
    try {
        const {name} = req.body;
        if (name == null) {
            res.status(400).json({success: false, message: "name required in request body"});
            return
        }
        let update = await prisma.gadget.update({
            where: {
                name: name
            },
            data: {
                status: "Decommissioned",
                timestamp: new Date()
            }
        });
        res.status(201).json({success: true, message: update});
    } catch (err) {
        console.log(err);
        res.status(400).json({success: false, message: err});
    }
});

router.post("/gadgets/:id/self-destruct", async (req, res) => {
    try {
        const { id } = req.params;
        const {confirmationCode} = req.body;
        if (confirmationCode == null) {
            res.status(400).json({success: false, message: "confirmationCode field is mandatory"});
            return
        }
        let update = await prisma.gadget.update({
            where: {
                id: id
            },
            data: {
                status: "Destroyed",
                timestamp: new Date()
            }
        });
        res.status(201).json({success: true, message: update});

    } catch (err) {
        console.log(err);
        res.status(500).json({success: false, message: err});
    }
})
module.exports = router;