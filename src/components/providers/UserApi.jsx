const userDetail = {
    id: 1,
    name: "Foo",
    job: "Noob developer",
    place: "Mars"
};

import React from "react";
import axios from "axios";

function getUser(user) {
    return new Promise((resolve, reject) =>
        setTimeout(() => {
            if (user === "foo") return resolve(userDetail);
            return reject("No such user");
        }, 2000)
    );
}

export default getUser;