exports.allAccess = (req, res) => {
    res.status(200).send("Public content.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User content.");
};

exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator content.");
};

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin content.");
}