const { ClientDetail } = require("../models/clientModel");

const createClient = async (req, res) => {
  try {
    const userId = req.user._id;

    req.body.user = userId;

    if (!/^[a-z A-Z]+$/.test(req.body.firstName)) {
      return res.status(400).json({ type: "bad", message: "First name must contain only letters from A-Z and a-z" });
    }
    if (!/^[a-z A-Z]+$/.test(req.body.lastName)) {
      return res.status(400).json({ type: "bad", message: "Last name must contain only letters from A-Z and a-z" });
    }
    if (!isValidEmail(req.body.email)) {
      return res.status(400).json({ type: "bad", message: "Email must be valid and contain '@'" });
    }
    // if (!/^[a-z A-Z 0-9 ,]+$/.test(req.body.address1)) {
    //   return res.status(400).json({ type: "bad", message: "Address1 name must contain only letters from A-Z and a-z and 0-9" });
    // }   
    // if (!/^[a-z A-Z 0-9]+$/.test(req.body.address2)) {
    //   return res.status(400).json({ type: "bad", message: "Address2 name must contain only letters from A-Z and a-z and 0-9" });
    // } 
    if (!/^[a-z A-Z]+$/.test(req.body.city)) {
      return res.status(400).json({ type: "bad", message: "City name must contain only letters from A-Z and a-z" });
    } if (!/^[a-z A-Z]+$/.test(req.body.state)) {
      return res.status(400).json({ type: "bad", message: "State name must contain only letters from A-Z and a-z" });
    }
    const clientType = req.body.clientType;
    if (!clientType || !["individual", "organization"].includes(clientType)) {
      return res.status(400).send({ message: "Invalid client type provided." });
    }
    const newRecord = await ClientDetail.create(req.body);

    res.status(200).send(newRecord);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while creating the client.",
    });
  }
};

function isValidEmail(email) {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
}
const getAllClient = async (req, res) => {
  try {
    const userId = req.user._id;

    const allClient = await ClientDetail.find({ user: userId });

    res.status(200).send({
      totalItems: allClient.length,
      data: allClient,
    });
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        "Some error occurred while retrieving clients.",
    });
  }
};

// const getAllClient = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const allClient = await ClientDetail.find({ user: userId });
//     const page = parseInt(req.query.page) || 1;
//     const pageSize = parseInt(req.query.pageSize) || 10;

//     const startIndex = (page - 1) * pageSize;
//     const endIndex = page * pageSize;

//     const paginatedRecords = allClient.slice(startIndex, endIndex);

//     res.status(200).send({
//       page,
//       pageSize,
//       totalItems: allClient.length,
//       totalPages: Math.ceil(allClient.length / pageSize),
//       data: paginatedRecords,
//     });
//   } catch (error) {
//     res.status(500).send({
//       message:
//         error.message ||
//         "Some error occurred while retrieving clients.",
//     });
//   }
// };

const getClientById = async (req, res) => {
  try {
    const profileId = req.params.id;
    const record = await ClientDetail.findById(profileId);
    if (!record) {
      return res.status(404).json({
        message: "Client profile not found with id " + profileId,
      });
    }

    res.status(200).json(record);
  } catch (error) {
    console.error("Error retrieving client profile: ", error);
    res.status(500).json({
      message: "Internal server error while retrieving the client profile.",
    });
  }
};

const deleteClient = async (req, res) => {
  try {
    const recordId = req.params.id;
    const deletedRecord = await ClientDetail.findByIdAndDelete(recordId);

    if (!deletedRecord) {
      return res
        .status(404)
        .send({ message: "Record not found for deletion." });
    }

    return res.status(200).json({ message: "Successfully deleted record of the ClientDetail",recordId });
    //console.log("Deleted Record", deletedRecord);
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        "Some error occurred while deleting the business profile.",
    });
  }
};

const updateClient = async (req, res) => {
  try {
    if (!req.body.firstName || !/^[a-z A-Z]+$/.test(req.body.firstName)) {
      return res.status(400).json({ type: "bad", message: "firstName must contain only letters from A-Z and a-z" });
    }

    if (!req.body.lastName || !/^[a-z A-Z]+$/.test(req.body.lastName)) {
      return res.status(400).json({ type: "bad", message: "lastName must contain only letters from A-Z and a-z" });
    }

    if (!isValidEmail(req.body.email)) {
      return res.status(400).json({ type: "bad", message: "Email must be valid and contain '@'" });
    }
    
    // if (!/^[a-z A-Z 0-9 ,]+$/.test(req.body.address1)) {
    //   return res.status(400).json({ type: "bad", message: "Address1 name must contain only letters from A-Z and a-z" });
    // }   
    // if (!/^[a-z A-Z 0-9]+$/.test(req.body.address2)) {
    //   return res.status(400).json({ type: "bad", message: "Address2 name must contain only letters from A-Z and a-z" });
    // } 
    if (!/^[a-z A-Z]+$/.test(req.body.city)) {
      return res.status(400).json({ type: "bad", message: "City name must contain only letters from A-Z and a-z" });
    }
     if (!/^[a-z A-Z]+$/.test(req.body.state)) {
      return res.status(400).json({ type: "bad", message: "State name must contain only letters from A-Z and a-z" });
    }
    // if (!req.body.organizationName || !/^[a-z A-Z]+$/.test(req.body.organizationName)) {
    //   return res.status(400).json({ type: "bad", message: "OrganizationName must contain only letters from A-Z and a-z" });
    // }

    const recordId = req.params.id;
    const updateData = req.body;

    const updatedRecord = await ClientDetail.findByIdAndUpdate(
      recordId,
      updateData,
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).send({ message: "Record not found for update." });
    }

    res.status(200).send(updatedRecord);
    //console.log("Updated Record", updatedRecord);
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        "Some error occurred while updating the business profile.",
    });
  }
};

function isValidEmail(email) {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
}

module.exports = {
  createClient,
  getAllClient,
  getClientById,
  deleteClient,
  updateClient,
};
