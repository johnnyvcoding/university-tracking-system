const chai = require("chai")
const chaiHttp = require("chai-http")
const app = require("../server/index")

const {expect} = chai


chai.should()

chai.use(chaiHttp)


describe("API Security", () => {
    describe("GET PROFESSORS", () => {
        it("Should return a 401", (done) => {
            //should return a 401 because no api key was passed
            // and no userId was passed in the request body 
            chai.request(app)
            .get("/api/professors")
            .end((err, response) => {
                response.should.have.status(401)
            })
            done()
        })
    })

})