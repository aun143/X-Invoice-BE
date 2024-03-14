const { ClientDetail } = require("../models/clientModel");
const { userModel } = require("../models/usersModel");

const createClient = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = req.user;
    const maxClientsAllowed = user.subscription.isActive ? user.maxClients : 3;

    const userClientsCount = await ClientDetail.countDocuments({
      user: user._id,
    });
    if (userClientsCount >= maxClientsAllowed) {
      return res
        .status(400)
        .json({ message: "Maximum clients limit reached for the user" });
    }
    if (user.subscription.endDate && user.subscription.endDate < new Date()) {
      return res.status(400).json({
        message: "Your subscription plan has expired. Please update your plan.",
      });
    }
    req.body.user = userId;

    if (!/^[a-zA-Z]+$/.test(req.body.firstName)) {
      return res.status(400).json({
        type: "bad",
        message: "First name must contain only letters from A-Z and a-z",
      });
    }
    
    if (req.body.firstName.length < 3 || req.body.firstName.length > 20) {
      return res.status(400).json({
        type: "bad",
        message: "firstName must be between 3 and 20 characters",
      });
    }
    if (!/^[a-zA-Z]+$/.test(req.body.lastName)) {
      return res.status(400).json({
        type: "bad",
        message: "Last name must contain only letters from A-Z and a-z",
      });
    }
    if (req.body.lastName.length < 3 || req.body.lastName.length > 20) {
      return res.status(400).json({
        type: "bad",
        message: "lastName must be between 3 and 20 characters",
      });
    }
    if (!isValidEmail(req.body.email)) {
      return res
        .status(400)
        .json({ type: "bad", message: "Email must be valid and contain '@'" });
    }
    if (!/^[a-zA-Z]+$/.test(req.body.city)) {
      return res.status(400).json({
        type: "bad",
        message: "City name must contain only letters from A-Z and a-z",
      });
    }
    if (req.body.city.length < 3 || req.body.city.length > 20) {
      return res.status(400).json({
        type: "bad",
        message: "City must be between 3 and 20 characters",
      });
    }
    if (!/^[a-zA-Z]+$/.test(req.body.state)) {
      return res.status(400).json({
        type: "bad",
        message: "State name must contain only letters from A-Z and a-z",
      });
    }
    if (req.body.state.length < 3 || req.body.state.length > 20) {
      return res.status(400).json({
        type: "bad",
        message: "State must be between 3 and 20 characters",
      });
    }
    if (req.body.phone) {
      if (! /^\+[0-9]+$/.test(req.body.phone)) {
        return res.status(400).json({
          type: "bad",
          message: "Invalid phone number format. It must start with '+' and contain only digits (0-9)",
        });
      }
      if (req.body.phone.length !== 13) {
        return res.status(400).json({
          type: "bad",
          message: "Phone number must be 13 digits long",
        });
      }
    }   
    // console.log("phone",phone)
     if (req.body.faxNumber) {
      if (! /^\+[0-9]+$/.test(req.body.faxNumber)) {
        return res.status(400).json({
          type: "bad",
          message: "Invalid faxNumber  format. It must start with '+' and contain only digits (0-9)",
        });
      }
      if (req.body.faxNumber.length !== 13) {
        return res.status(400).json({
          type: "bad",
          message: "faxNumber must be 13 digits long",
        });
      }
    }
   
    const clientType = req.body.clientType;
    if (!clientType || !["individual", "organization"].includes(clientType)) {
      return res.status(400).send({ message: "Invalid client type provided." });
    }

    const newRecord = await ClientDetail.create(req.body);

    res.status(200).send({
      message: "Client created successfully",
      data: newRecord
    });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the client.",
    });
  }
};

// const createClient = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     // Fetch the user document and populate the userRole field
//     const user = await userModel.findById(userId).populate("userRole");
//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     const userRole = user.userRole.role; // Access the role property from the populated userRole

//     req.body.user = userId;

//     console.log("userRole", userRole);
//     // Your validation code goes here...

//     let maxClientLimit;
//     if (userRole === "admin") {
//       maxClientLimit = 3;
//     } else if (userRole === "superadmin") {
//       maxClientLimit = 10;
//     } else {
//       return res
//         .status(403)
//         .json({
//           message:
//             "Only admin or superadmin users are allowed to create clients.",
//         });
//     }

//     // Check if the user has already reached the maximum limit
//     const userClientsCount = await ClientDetail.countDocuments({
//       user: userId,
//     });
//     if (userClientsCount >= maxClientLimit) {
//       return res
//         .status(400)
//         .json({
//           type: "bad",
//           message: `You have reached the maximum limit of ${maxClientLimit} clients.`,
//         });
//     }

//     // Create the client record
//     const newRecord = await ClientDetail.create(req.body);

//     // Return the response with createdByUserRole included
//     res.status(200).send({ newRecord, createdByUserRole: userRole });
//   } catch (error) {
//     res.status(500).send({
//       message:
//         error.message || "Some error occurred while creating the client.",
//     });
//   }
// };

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
      message: "Get All Client successfully",
      data: allClient,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving clients.",
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

    res.status(200).json(
      // message: "Get Client profile Successfully",
       record);
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

    return res.status(200).json({
      message: "Successfully deleted record of the ClientDetail",
      recordId,
    });
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
      return res.status(400).json({
        type: "bad",
        message: "firstName must contain only letters from A-Z and a-z",
      });
    }
    if (req.body.firstName.length < 3 || req.body.firstName.length > 20) {
      return res.status(400).json({
        type: "bad",
        message: "firstName must be between 3 and 20 characters",
      });
    }
    if (!req.body.lastName || !/^[a-z A-Z]+$/.test(req.body.lastName)) {
      return res.status(400).json({
        type: "bad",
        message: "lastName must contain only letters from A-Z and a-z",
      });
    }
    if (req.body.lastName.length < 3 || req.body.lastName.length > 20) {
      return res.status(400).json({
        type: "bad",
        message: "lastName must be between 3 and 20 characters",
      });
    }
    if (!isValidEmail(req.body.email)) {
      return res
        .status(400)
        .json({ type: "bad", message: "Email must be valid and contain '@'" });
    }

    // if (!/^[a-z A-Z 0-9 ,]+$/.test(req.body.address1)) {
    //   return res.status(400).json({ type: "bad", message: "Address1 name must contain only letters from A-Z and a-z" });
    // }
    // if (!/^[a-z A-Z 0-9]+$/.test(req.body.address2)) {
    //   return res.status(400).json({ type: "bad", message: "Address2 name must contain only letters from A-Z and a-z" });
    // }
    if (!/^[a-z A-Z]+$/.test(req.body.city)) {
      return res.status(400).json({
        type: "bad",
        message: "City name must contain only letters from A-Z and a-z",
      });
    }
    if (req.body.city.length < 3 || req.body.city.length > 20) {
      return res.status(400).json({
        type: "bad",
        message: "City must be between 3 and 20 characters",
      });
    }
    if (!/^[a-z A-Z]+$/.test(req.body.state)) {
      return res.status(400).json({
        type: "bad",
        message: "State name must contain only letters from A-Z and a-z",
      });
    }
    if (req.body.state.length < 3 || req.body.state.length > 20) {
      return res.status(400).json({
        type: "bad",
        message: "State must be between 3 and 20 characters",
      });
    }
    if (req.body.phone) {
      if (! /^\+[0-9]+$/.test(req.body.phone)) {
        return res.status(400).json({
          type: "bad",
          message: "Invalid phone number format. It must start with '+' and contain only digits (0-9)",
        });
      }
      if (req.body.phone.length !== 13) {
        return res.status(400).json({
          type: "bad",
          message: "Phone number must be 13 digits long",
        });
      }
    }   
     if (req.body.faxNumber) {
      if (! /^\+[0-9]+$/.test(req.body.faxNumber)) {
        return res.status(400).json({
          type: "bad",
          message: "Invalid faxNumber  format. It must start with '+' and contain only digits (0-9)",
        });
      }
      if (req.body.faxNumber.length !== 13) {
        return res.status(400).json({
          type: "bad",
          message: "faxNumber must be 13 digits long",
        });
      }
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

    res.status(200).send({
      message: "Client profile updated successfully",
      updatedData:updatedRecord});
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
