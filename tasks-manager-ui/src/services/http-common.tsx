import axios from "axios";

export default axios.create({
    // baseURL: "http://localhost:4300/", - local
    baseURL: "http://localhost:3110/",
    headers: {
        "Content-type": "application/json"
    }
});
