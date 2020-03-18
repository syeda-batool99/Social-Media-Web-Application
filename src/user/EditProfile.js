import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { read } from "./apiUser";
import { Redirect } from "react-router-dom";
import { update } from "./apiUser";
import DefaultProfile from "../images/user_avatar.png"

export class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      phone: "",
      DOB: "",
      gender: "",
      redirectToProfile: false,
      error:"",
      loading: false,
      fileSize: 0
    };
  }

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          error: ""
        });
      }
    });
  };

  componentDidMount() {
    this.userData = new FormData() //profile photo
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  isValid = () => {
      const {name,fileSize} = this.state;
        if(name.length===0){
            this.setState({error:"Name is required"})
            return false
        }
        if(fileSize>100000){
          this.setState({error:"File size should be less than 1MB"})
          return false
      }
        return true;
  }

  handleChange = name => event => {
    this.setState ({error: ""})
    const value = name === 'photo' ? event.target.files[0] : event.target.value 
    const fileSize = name === "photo" ? event.target.files[0].size : 0
    this.userData.set(name,value)
    this.setState({ [name]: value, fileSize });
  };

  clickSubmit = event => {
    event.preventDefault();
    this.setState({loading:true})
    if(this.isValid()){
    const userId = this.props.match.params.userId;
    const token = isAuthenticated().token;

    update(userId, token, this.userData).then(data => {
      if (data.error) this.setState({ error: data.error });
      else
        this.setState({
          redirectToProfile: true
        });
    });
    }
  };

  render() {
    const {
      id,
      name,
      password,
      phone,
      DOB,
      gender,
      redirectToProfile,error, loading
    } = this.state;
    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`}></Redirect>;
    }
         
    const PhotoURL = id ? `http://localhost:8001/user/photo/${id}?${new Date().getTime()}` : DefaultProfile;
    
    return <div>
         <div className="alert alert-danger" 
                   style ={{display: error ? "" : "none"}}> 
                        {error}
              </div>
              {loading ? ( <div className="jumbotron text-center">
                  <h2> Loading.. </h2>
              </div> )
              : ("")
              }
<form>
      <div className="container">
        <div className="row">
          <div className="col-lg-3"> 
          <img
              src={PhotoURL}
              alt={name}
              style={{ marginTop: "35px", height: "200px", width: "auto" }}
              className="img-thumbnail"
              onError={i => (i.target.src = `${DefaultProfile}`)}
            ></img>
            <p></p>
              <input
                onChange={this.handleChange("photo")}
                type="file"
                accept="image"
              />
  
          </div>
          <div className="col-lg-6">
          <br/> <br/>
            <h2 >Edit Profile</h2>
            <div className="form-group">
                
              <label className="text-muted"> Name </label>
              <input
                onChange={this.handleChange("name")}
                type="text"
                className="form-control"
                value={name}
              />
            </div>
            <div className="form-group">
              <label className="text-muted"> Password </label>
              <input
                onChange={this.handleChange("password")}
                type="password"
                className="form-control"
                value={password}
              />
            </div>
            <div className="form-group">
              <label className="text-muted"> Phone Number </label>
              <input
                onChange={this.handleChange("phone")}
                type="number"
                className="form-control"
                value={phone}
              />
            </div>
            <div className="form-group">
              <label className="text-muted"> Date of Birth </label>
              <input
                onChange={this.handleChange("DOB")}
                type="date"
                className="form-control"
                value={DOB}
              />
            </div>
            <div className="form-group">
              <label className="text-muted"> Gender </label>
              <input
                onChange={this.handleChange("gender")}
                type="text"
                className="form-control"
                value={gender}
              />
            </div>
            <div>
              <button
                onClick={this.clickSubmit}
                style={{
                  backgroundColor: "#00a3f0",
                  borderRadius: "8px",
                  color: "white",
                  width: "110px",
                  height: "38px",
                  marginLeft: "418px"
                }}
              >
                {" "}
                Update{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
    </div>
  }
}


export default EditProfile;
