const { BusinessProfile } = require("../models/businessModel");
const { userModel } = require("../models/usersModel");

const createBusinessProfile = async (req, res) => {
  try {
    const { userId, profileBody } = req.body;
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "address1",
      "country",
      "city",
    ];

    for (const field of requiredFields) {
      if (!profileBody[field]) {
        return res.status(400).json({
          type: "bad",
          message: `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } is required`,
        });
      }
    }
    if (!/^[a-z A-Z]+$/.test(profileBody.firstName)) {
      return res.status(400).json({
        type: "bad",
        message: "firstName must contain only letters from A-Z and a-z",
      });
    }
    if (profileBody.firstName.length < 3 || profileBody.firstName.length > 10) {
      return res.status(400).json({
        type: "bad",
        message: "firstName must be between 3 and 10 characters",
      });
    }
    if (!/^[a-z A-Z]+$/.test(profileBody.lastName)) {
      return res.status(400).json({
        type: "bad",
        message: "lastName must contain only letters from A-Z and a-z",
      });
    }
    if (profileBody.lastName.length < 3 || profileBody.lastName.length > 10) {
      return res.status(400).json({
        type: "bad",
        message: "lastName must be between 3 and 10 characters",
      });
    }
    if (profileBody.phone) {
      if (profileBody.phone) {
        if (!/^\+[0-9]+$/.test(profileBody.phone)) {
          return res.status(400).json({
            type: "bad",
            message:
              "Invalid phone number format. It must start with '+' and contain only digits (0-9)",
          });
        }
        if (profileBody.phone.length !== 13) {
          return res.status(400).json({
            type: "bad",
            message: "Phone number must be 13 digits long",
          });
        }
      }
    }
    if (!isValidEmail(profileBody.email)) {
      return res
        .status(400)
        .json({ type: "bad", message: "Email must be valid and contain '@'" });
    }

    // if (!/^[a-z A-Z 0-9 ,]+$/.test(profileBody.address1)) {
    //   return res.status(400).json({ type: "bad", message: "Address1 must contain only letters and numbers." });
    // }
    // if (!/^[a-z A-Z 0-9 ,]+$/.test(profileBody.address2)) {
    //   return res.status(400).json({ type: "bad", message: "Address2 must contain only letters from A-Z and a-z" });
    // }
    if (!/^[a-z A-Z]+$/.test(profileBody.city)) {
      return res.status(400).json({
        type: "bad",
        message: "City must contain only letters from A-Z and a-z",
      });
    }
    if (profileBody.city.length < 3 || profileBody.city.length > 15) {
      return res.status(400).json({
        type: "bad",
        message: "city must be between 3 and 15 characters",
      });
    }
    if (profileBody.companyName) {
      if (!/^[a-zA-Z]+$/.test(profileBody.companyName)) {
        return res.status(400).json({
          type: "bad",
          message: "CompanyName must contain only letters from A-Z and a-z",
        });
      }
      if (
        profileBody.companyName.length < 3 ||
        profileBody.companyName.length > 20
      ) {
        return res.status(400).json({
          type: "bad",
          message: "companyName must be between 3 and 20 characters",
        });
      }
    }

    // if (!/^[a-z A-Z ]+$/.test(profileBody.this.state)) {
    //   return res.status(400).json({ type: "bad", message: "State must contain only letters from A-Z and a-z" });
    // }
    // if (!isValidUrl(profileBody.this.websiteURL)) {
    //   return res.status(400).json({ type: "bad", message: "Website URL is not valid." });
    // }
    const singleUser = await userModel.findById(userId);

    if (
      singleUser &&
      !singleUser.individualProfile &&
      !singleUser.organizationProfile
    ) {
      profileBody.profileType = "individual";
      const newIndividualProfile = await BusinessProfile.create(profileBody);

      profileBody.profileType = "organization";

      const newOrganizationProfile = await BusinessProfile.create(profileBody);

      singleUser.individualProfile = newIndividualProfile._id;
      singleUser.organizationProfile = newOrganizationProfile._id;

      await singleUser.save();

      const populatedUser = await userModel
        .findById(userId)
        .populate("individualProfile")
        .populate("organizationProfile")
        .exec();

      return res.status(200).send({
        message: "Created Business Profile successfully",
        createProfile: populatedUser,
      });
    } else {
      return res.status(404).json({
        message:
          "User not found or userId is invalid or This User Profile Is Already Exist.",
      });
    }
  } catch (error) {
    return res.status(500).send({
      message:
        error.message ||
        "Some error occurred while creating the business profile.",
    });
  }
};

function isValidEmail(email) {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
}

const getAllBusinessProfile = async (req, res) => {
  try {
    const records = await BusinessProfile.find();

    res.status(200).send({
      message: "Get All Business profile successfully",
      getAllProfiles: records,
    });
    // console.log("Get All BusinessProfiles", records);
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        "Some error occurred while retrieving business profiles.",
    });
  }
};

const getBusinessProfileById = async (req, res) => {
  try {
    const profileId = req.params.id;
    const record = await BusinessProfile.findById(profileId);
    if (!record) {
      return res.status(404).json({
        message: "Business profile not found with id " + profileId,
      });
    }

    res.status(200).json({
      message: "Get Business profile Successfully",
      getRecord: record,
    });
  } catch (error) {
    console.error("Error retrieving business profile: ", error);
    res.status(500).json({
      message: "Internal server error while retrieving the business profile.",
    });
  }
};

const deleteBusinessProfile = async (req, res) => {
  try {
    const recordId = req.params.id;
    const deletedRecord = await BusinessProfile.findByIdAndDelete(recordId);

    if (!deletedRecord) {
      return res
        .status(404)
        .send({ message: "Record not found for deletion." });
    }

    return res.status(200).json({
      message: "Successfully deleted record of the BusinessProfile",
      recordId,
    });
    // console.log("Deleted Record", deletedRecord);
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        "Some error occurred while deleting the business profile.",
    });
  }
};

const updateBusinessProfile = async (req, res) => {
  try {
    const recordId = req.params.id;
    const updateData = req.body;
    const requiredFields = ["firstName", "lastName", "email"];

    for (const field of requiredFields) {
      if (!updateData[field]) {
        return res.status(400).json({
          type: "bad",
          message: `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } is required`,
        });
      }
    }

    if (!/^[a-z A-Z]+$/.test(updateData.firstName)) {
      return res.status(400).json({
        type: "bad",
        message: "First name must contain only letters from A-Z and a-z",
      });
    }
    if (updateData.firstName.length < 3 || updateData.firstName.length > 10) {
      return res.status(400).json({
        type: "bad",
        message: "firstName must be between 3 and 10 characters",
      });
    }
    if (!/^[a-z A-Z]+$/.test(updateData.lastName)) {
      return res.status(400).json({
        type: "bad",
        message: "Last name must contain only letters from A-Z and a-z",
      });
    }
    if (updateData.lastName.length < 3 || updateData.lastName.length > 10) {
      return res.status(400).json({
        type: "bad",
        message: "lastName must be between 3 and 10 characters",
      });
    }
    if (!isValidEmail(updateData.email)) {
      return res
        .status(400)
        .json({ type: "bad", message: "Email must be valid and contain '@'" });
    }

    // if (!/^[a-z A-Z 0-9 ,]+$/.test(updateData.address1)) {
    //   return res.status(400).json({ type: "bad", message: "Address1 must contain only letters from A-Z and a-z" });
    // }
    // if (!/^[a-z A-Z 0-9 ,]+$/.test(updateData.address2)) {
    //   return res.status(400).json({ type: "bad", message: "Address2 must contain only letters from A-Z and a-z" });
    // }
    if (!/^[a-z A-Z]+$/.test(updateData.city)) {
      return res.status(400).json({
        type: "bad",
        message: "City must contain only letters from A-Z and a-z",
      });
    }
    if (updateData.city.length < 3 || updateData.city.length > 15) {
      return res.status(400).json({
        type: "bad",
        message: "City must be between 3 and 15 characters",
      });
    }
    if (updateData.companyName) {
      if (!/^[a-z A-Z]+$/.test(updateData.companyName)) {
        return res.status(400).json({
          type: "bad",
          message: "CompanyName must contain only letters from A-Z and a-z",
        });
      }
      if (
        updateData.companyName.length < 3 ||
        updateData.companyName.length > 20
      ) {
        return res.status(400).json({
          type: "bad",
          message: "companyName must be between 3 and 20 characters",
        });
      }
    }
    if (updateData.phone) {
      if (!/^\+[0-9]+$/.test(updateData.phone)) {
        return res.status(400).json({
          type: "bad",
          message:
            "Invalid phone number format. It must start with '+' and contain only digits (0-9)",
        });
      }
      if (updateData.phone.length !== 13) {
        return res.status(400).json({
          type: "bad",
          message: "Phone number must be 13 digits long",
        });
      }
    }
    const updatedRecord = await BusinessProfile.findByIdAndUpdate(
      recordId,
      updateData,
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).send({ message: "Record not found for update." });
    }

    res.status(200).send({
      message: "Business profile updated successfully",
      updatedData: updatedRecord,
    });
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
  createBusinessProfile,
  getAllBusinessProfile,
  getBusinessProfileById,
  updateBusinessProfile,
  deleteBusinessProfile,
};
