import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";
import Chart from 'chart.js';
/* global Handlebars */

// front-end variables      
const host = "https://voting-app-sosmaniac.c9users.io/";
const ele = document.getElementById("user");
let userVars; if (ele != null)
    userVars = ele.innerHTML.toString().split(',');

$(() => {
    
    /***************************************************************************************/
    /** COMPONENTS *************************************************************************/
    /***************************************************************************************/
    
    function HelloMessage(props) {
        if (!props.isLoggedIn) {
            return null;
        }
        else {
            return (
                <a className={"navbar-nav my-2 mr-5 hidden-xs"}>
                    <h4 className={"mb-0 text-primary"}>Hello {userVars[0]}!</h4>
                </a>
            );
        }
    }
    
    function ProfileButton(props) {
        if (!props.isLoggedIn) {
            return null;
        }
        else {
            return (
                <li className={"nav-item ml-2 active"}>
                    <button className={"btn btn-outline-info nav-link"} onClick={props.handleProfile}>Profile</button>
                </li>
            );
        }
    }
    
    class MenuBar extends React.Component {
        constructor(props) {
            super(props);
        }
        
        handleMain() {
            window.location.href = host;
        }
        
        handleProfile() {
            window.location.href = host + "profile";
        }
            
        handleLogin() {
            window.location.href = host + "login";
        }
        
        handleLogout() {
            window.location.href = host + "logout";
        }
        
        render() {
            return (
                <nav className={"navbar navbar-expand navbar-light bg-light border-top-0 border-left-0 border-right-0 border border-primary"}>
                    <h1 className={"navbar-brand ml-0 text-primary"} onClick={this.handleMain.bind(this)} style={{cursor: "pointer"}}>Voting App</h1>
                    <ul className={"navbar-nav mr-auto"}>
                        <li className={"nav-item ml-2 active"}>
                            <button className={"btn btn-outline-success nav-link"} onClick={this.handleMain.bind(this)}>Home<span className={"sr-only"}>(current)</span></button>
                        </li>
                        <ProfileButton isLoggedIn={this.props.isLoggedIn} handleProfile={this.handleProfile.bind(this)}/>
                        <li className={"nav-item ml-2 active"}>
                            <button className={"btn btn-outline-secondary nav-link"} onClick={!this.props.isLoggedIn ? this.handleLogin.bind(this) : this.handleLogout.bind(this)}>{!this.props.isLoggedIn ? 'Login' : 'Logout'}</button>
                        </li>
                    </ul>
                    <HelloMessage isLoggedIn={this.props.isLoggedIn} />
                    <a className={"hidden-md"}>
                        <p className={"mb-0 text-muted"} style={{fontSize: "10px"}}>Coded by John Simmons</p>
                    </a>
                </nav>
            );
        }
    }
    
    function HeaderOptions(props) {
        if (props.isLoggedIn) {
            return (
                <div className={"row justify-content-center mt-4"}>
                    <button className={"btn btn-success mr-1"} onClick={props.handleCreate}>Create a Poll</button>
                    <button className={"btn btn-primary ml-1"} onClick={props.handleMyPolls}>View my Polls</button>
                </div>
            );
        }
        else {
            return <h6 className={"text-success text-center mt-2 mb-0"} style={{fontWeight: "bold", cursor: "pointer"}} onClick={props.handleLR}>To create polls, click here to login/register!</h6>;
        }
    }
    
    class Header extends React.Component {
        constructor(props) {
            super(props);
        }
        
        handleLoginRegister() {
            window.location.href = host + "login";
        }
        
        handleMyPolls() {
            window.location.href = host + "mypolls";
        }
        
        handleCreate() {
            window.location.href = host + "create";
        }
        
        render() {
            return (
                <div className={"col-12 justify-content-center rounded bg-light border border-primary my-3 mx-auto py-4"}>
                    <div className={"row justify-content-center mb-3"}>
                        <img src="https://avatars3.githubusercontent.com/u/26840799?v=3&s=400" alt="sosmaniac-FCC Profile Image" height="42" width="42" className={"rounded mr-3 hidden-xxs"} />
                        <h1 className={"text-muted"}>FCC Voting</h1>
                        <img src="https://avatars3.githubusercontent.com/u/9892522?s=280&v=4" alt="FreeCodeCamp Campfire" height="42" width="42" className={"rounded ml-3 hidden-xxs"} />
                    </div>
                    <h6 className={"text-info text-center"}>Currently hosting {this.props.totalPolls} poll{this.props.totalPolls > 1 ? 's' : ''}.</h6>
                    <h6 className={"text-info text-center"}>Click any poll below to view its results and vote.</h6>
                    <HeaderOptions isLoggedIn={this.props.isLoggedIn} handleMyPolls={this.handleMyPolls.bind(this)} handleCreate={this.handleCreate.bind(this)} handleLR={this.handleLoginRegister.bind(this)} />
                </div>
            );
        }
    }
    
    class UserHeader extends React.Component {
        constructor(props) {
            super(props);
        }
        
        handleCreate() {
            window.location.href = host + "create";
        }
        
        render() {
            if (this.props.userPolls > 0) {
                return (
                    <div className={"col-12 justify-content-center rounded bg-light border border-primary my-3 mx-auto py-4"}>
                        <h6 className={"text-info text-center"}>Here{this.props.userPolls > 1 ? ' are all ' + this.props.userPolls + ' of your polls' : ' is your poll'}, {userVars[0]}.</h6>
                        <h6 className={"text-info text-center"}>Thanks so much for contributing to FCC Voting!</h6>
                        <button onClick={this.handleCreate.bind(this)} className={"d-block mx-auto mt-3 mb-0 btn btn-success"}>New Poll</button>
                    </div>
                );
            }
            else {
                return (
                    <div className={"col-12 justify-content-center rounded bg-light border border-primary my-3 mx-auto py-4"}>
                        <h6 className={"text-info text-center"}>You have not made any polls yet... ;(</h6>
                        <h6 onClick={this.handleCreate.bind(this)} className={"text-success text-center"} style={{fontWeight: "bold", cursor: "pointer"}}>Create one by clicking here!</h6>
                    </div>
                );
            }
        }
    }
    
    function GenerateHandlebarsAlert(props) {
        const template = Handlebars.compile(props.source);
        
        if (props.type == 'blocked-single') {
            const target = document.getElementsByClassName("flag-alert")[0];
            let conversion = '...';
            if (typeof target != 'undefined') {
                if (target.id == "success-msg")
                    conversion = {"success_msg": target.innerHTML};
                else if (target.id == "error-msg")
                    conversion = {"error_msg": target.innerHTML};
                else if (target.id == "error")
                    conversion = {"error": target.innerHTML};
                else if (target.id == "success")
                    conversion = {"success": target.innerHTML};
                else
                    conversion = {};
            }
            else {
                conversion = {};
            }
            
            return <div dangerouslySetInnerHTML={{__html: template(conversion)}}></div>;
        }
        else if (props.type == 'stacked-group') {
            const targets = document.getElementsByClassName("flag-register");
            const conversions = [];
            for (let i = 0; i < targets.length; i++) {
                conversions.push({"msg": targets[i].innerHTML});
            }
            
            return <div dangerouslySetInnerHTML={{__html: template({errors: conversions})}}></div>;
        }
        else {
            return null;
        }
    }
    
    function GetContent(props) {
        if (props.whatContent == 0) {
            return (
                <div>
                    <p className={"mb-1"}>Username</p>
                    <h6 className={"text-primary"}>{userVars[0]}</h6>
                    <p className={"mb-1"}>{props.isTwitter ? 'Twitter' : 'Email'}</p>
                    <h6 className={"text-primary"}>{userVars[1]}</h6>
                </div>
            );
        }
        else if (props.whatContent == 1) {
            // POST performing a PUT operation due to form restrictions
            if (!props.isTwitter) {
                return (
                    <form className={"my-2"} method="post" action={host + "change"}>
                        <div className={"form-group mb-2 mt-4"}>
                            <p className={"mb-0"}>Current Password</p>
                            <input type="password" name="pass-current" id="pass-current" className={"col-8 d-block rounded"} placeholder="..." />
                        </div>
                        <div className={"form-group mb-2"}>
                            <p className={"mb-0"}>New Password</p>
                            <input type="password" name="pass-new" id="pass-new" className={"col-8 d-block rounded"} placeholder="..." />
                        </div>
                        <div className={"form-group mb-4"}>
                            <p className={"mb-0"}>Confirm Password</p>
            				<input type="password" name="pass-confirm" id="pass-confirm" className={"col-8 d-block rounded"} placeholder="..." />
            			</div>
            			<button type="submit" name="profile" className={"btn btn-outline-success my-4 d-block"}>Change Password</button>
                    </form>
                );
            }
            else {
                return (
                    <div>
                        <p className={"text-center"}>You logged in using Twitter. To change your password, please refer to your twitter account settings!</p>
                        <p className={"text-center"} style={{fontWeight: "bold", cursor: "pointer"}}><a href={userVars[1]} target="_blank">{userVars[1]}</a></p>
                    </div>
                );
            }
        }
        else {
            throw 'Where is the Content?!';
        }
    }
    
    function GetDropdown(props) {
        return (
            <div className={"dropdown"}>
                <button className={"btn btn-secondary dropdown-toggle"} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span className={"glyphicon glyphicon-list"}></span> <a id="dropdown-header">Profile Settings</a>
                </button>
                <div className={"dropdown-menu"} aria-labelledby="dropdownMenuButton">
                    <a className={"dropdown-item"} onClick={((arg) => {switch(arg) { case 0: return props.handleCP; case 1: return props.handleMP; default: throw 'Content Missing?';}})(props.whatContent)}>
                        {((arg) => {switch(arg) { case 0: return "Change Password"; case 1: return "Main Profile"; default: throw 'Content Missing!';}})(props.whatContent)}
                    </a>
                    <a className={"dropdown-menu"} aria-labelledby="dropdownMenuButton" href="#">
                        ...
                    </a>
                </div>
            </div>
        );
    }
    
    // removed: <th onClick={props.handleClick} id={item._id}>{item.creatorName}</th> from 'user'
    function TableContents(props) {
        let items = [];
        
        if (props.data != null && props.query == 'all') {
            props.data.forEach((item, i) => {
                items.push(
                    <tr onClick={props.handleClick} id={item._id} className={"text-info bg-light"} style={{cursor: "pointer"}} key={item._id}>
                        <th scope="row" id={item._id}>{i + 1}</th>
                        <th id={item._id}>{item.question}</th>
                        <th id={item._id}>{item.creatorName}</th>
                    </tr>
                );
            });
            
            return items;
        }
        else if (props.data != null && props.query == 'user') {
            props.data.forEach((item, i) => {
                items.push(
                    <tr id={item._id} className={"text-info bg-light"} style={{cursor: "pointer"}} key={item._id}>
                        <th onClick={props.handleClick} scope="row" id={item._id}>{i + 1}</th>
                        <th onClick={props.handleClick} id={item._id}>{item.question}</th>
                        <th style={{pointerEvents: "none"}}><button id={item._id} onClick={props.handleDelete} style={{pointerEvents: "auto"}} className={"btn btn-danger"}>Delete</button></th>
                    </tr>
                );
            });
            
            return items;
        }
        else {
            return null;
        }
    }
    
    // removed: <th>Created By</th> from 'user'
    function DynamicTableHead(props) {
        if (props.query == 'all') {
            return (
                <tr>
                    <th>#</th>
                    <th>Poll Name</th>
                    <th>Created By</th>
                </tr>
            );
        }
        else if (props.query == 'user') {
            return (
                <tr>
                    <th>#</th>
                    <th>Poll Name</th>
                    <th>Options</th>
                </tr>
            );
        }
        else {
            return null;
        }
    }
    
    class Table extends React.Component {
        constructor(props) {
            super(props);
            
            this.state = {
                data: null
            };
        }
        
        handleDelete(e) {
            $.ajax({
                url: host + 'mypolls/' + e.target.id,
                type: 'DELETE',
                success: (result) => {
                    $.get('/' + this.props.query, (update) => {
                        this.setState({
                            data: update
                        });
                    });
                }
            });
        }
        
        handleClick(e) {
            window.location.href = host + "poll/" + e.target.id;
        }
        
        componentDidMount() {
            $.get('/' + this.props.query, (data) => {
                this.setState({
                    data: data
                });
            });
        }
        
        render() {
            return (
                <table className={"table table-hover"}>
                    <thead className={"text-primary bg-light"}>
                        <DynamicTableHead query={this.props.query} />
                    </thead>
                    <tbody className={"text-muted"}>
                        <TableContents data={this.state.data} handleClick={this.handleClick.bind(this)} handleDelete={this.handleDelete.bind(this)} query={this.props.query} />
                    </tbody>
                </table>
            );
        }
    }

    /***************************************************************************************/
    /** MAIN AND MYPOLLS *******************************************************************/
    /***************************************************************************************/
    
    class Main extends React.Component {
        constructor(props) {
            super(props);
            
            this.state = {
                isLoggedIn: ele == null ? false : true,
                totalPolls: 0
            };
        }
        
        componentDidMount() {
            $.get('/all', (data) => {
                this.setState({
                    totalPolls: data.length
                });
            });
        }
        
        render() {
            return (
                <div>
                    <MenuBar isLoggedIn={this.state.isLoggedIn} />
                    <GenerateHandlebarsAlert type={'blocked-single'} source={`{{#if success_msg}}<div class="alert alert-success rounded-0 text-center">{{success_msg}}</div>{{/if}}
            {{#if error_msg}}<div class="alert alert-danger rounded-0 text-center">{{error_msg}}</div>{{/if}}
            {{#if error}}<div class="alert alert-danger rounded-0 text-center">{{error}}</div>{{/if}}
            {{#if success}}<div class="alert alert-success rounded-0 text-center">{{success}}</div>{{/if}}`} />
                    <div className={"container col-10"}>
                        <Header isLoggedIn={this.state.isLoggedIn} totalPolls={this.state.totalPolls} />
                        <Table query={'all'} />
                    </div>
                </div>
            );
        }
    }
    
    try { ReactDOM.render(<Main />, document.getElementById("main")); } catch (e) {}
    
    
    class MyPolls extends React.Component {
        constructor(props) {
            super(props);
            
            this.state = {
                isLoggedIn: ele == null ? false : true,
                userPolls: 0
            };
        }
        
        
        
        componentDidMount() {
            $.get('/user', (data) => {
                this.setState({
                    userPolls: data.length
                });
            });
        }
        
        render() {
            return (
                <div>
                    <MenuBar isLoggedIn={this.state.isLoggedIn} />
                    <div className={"container col-10"}>
                        <UserHeader userPolls={this.state.userPolls} />
                        <Table query={'user'} />
                    </div>
                </div>
            );
        }
    }
    
    try { ReactDOM.render(<MyPolls />, document.getElementById("mypolls")); } catch (e) {}
    
    /***************************************************************************************/
    /** LOGIN AND REGISTER *************************************************************/
    /***************************************************************************************/
    
    class Login extends React.Component {
        constructor() {
            super();
            
            this.state = {
                isLoggedIn: ele == null ? false : true
            };
        }
        
        handleRegisterToggle() {
            window.location.href = host + "register";
        }
        
        handleTwitterAuth() {
            window.location.href = host + "auth/twitter";
        }
        
        render() {
            return (
                <div>
                    <MenuBar isLoggedIn={this.state.isLoggedIn} />
                    <GenerateHandlebarsAlert type={'blocked-single'} source={`{{#if success_msg}}<div class="alert alert-success rounded-0 text-center">{{success_msg}}</div>{{/if}}
            {{#if error_msg}}<div class="alert alert-danger rounded-0 text-center">{{error_msg}}</div>{{/if}}
            {{#if error}}<div class="alert alert-danger rounded-0 text-center">{{error}}</div>{{/if}}
            {{#if success}}<div class="alert alert-success rounded-0 text-center">{{success}}</div>{{/if}}`} />
                    <div className={"container col-xs-10 col-sm-8 col-md-6 col-lg-4"}>
                        <div className={"col-12 justy-content-center bg-light rounded border border-primary mt-4 pb-3 mx-auto"}>
                            <div className={"row"}>
                                <div className={"col bg-dark"}>
                                    <h6 className={"text-center text-light"} style={{cursor: "pointer"}}>Login</h6>
                                </div>
                                <div className={"col bg-info"} onClick={this.handleRegisterToggle.bind(this)}>
                                    <h6 className={"text-center"} style={{cursor: "pointer"}}>New Account</h6>
                                </div>
                            </div>
                            <form className={"justify-content-center"} method="post" action={host + "login"}>
                                <div className={"form-group mb-2 mt-4"}>
                                    <p className={"text-center mb-0"}>Username</p>
                                    <input type="text" name="username" id="username" className={"mx-auto col-7 d-block rounded"} placeholder="..." />
                                </div>
                                <div className={"form-group mb-4"}>
                                    <p className={"text-center mb-0"}>Password</p>
        					        <input type="password" name="password" id="password" className={"mx-auto col-7 d-block rounded"} placeholder="..." />
        					    </div>
        					    <button type="submit" name="login" className={"btn btn-outline-success mx-auto my-4 col-3 d-block"}>Login</button>
                            </form>
                            <button className={"btn btn-block btn-social btn-twitter btn-sm"} onClick={this.handleTwitterAuth.bind(this)}>
                                <span className={"fa fa-twitter"}></span> Login with Twitter
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
    }
    
    try { ReactDOM.render(<Login />, document.getElementById("login")); } catch (e) {}

    
    class Register extends React.Component {
        constructor(props) {
            super(props);
            
            this.state = {
                isLoggedIn: ele == null ? false : true
            };
        }
        
        handleLoginToggle() {
            window.location.href = host + "login";
        }
        
        render() {
            return (
                <div>
                    <MenuBar isLoggedIn={this.state.isLoggedIn} />
                    <div className={"container col-xs-10 col-sm-8 col-md-6 col-lg-4"}>
                        <div className={"col-12 justy-content-center bg-light rounded border border-primary mt-4 mx-auto"}>
                            <div className={"row mb-4"}>
                                <div className={"col bg-info"} onClick={this.handleLoginToggle.bind(this)}>
                                    <h6 className={"text-center"} style={{cursor: "pointer"}}>Login</h6>
                                </div>
                                <div className={"col bg-dark"}>
                                    <h6 className={"text-center text-light"} style={{cursor: "pointer"}}>New Account</h6>
                                </div>
                            </div>
                            <GenerateHandlebarsAlert type={'stacked-group'} source={`{{#if errors}}{{#each errors}}<div class="alert alert-danger rounded-0 p-0 text-center">{{msg}}</div>{{/each}}{{/if}}`} />
                            <form className={"justify-content-center my-6"} method="post" action={host + "register"}>
                                <div className={"form-group mb-2 mt-4"}>
                                    <p className={"text-center mb-0"}>New Username</p>
                                    <input type="text" name="user-register" id="user-register" className={"mx-auto col-7 d-block rounded"} placeholder="..." />
                                </div>
                                <div className={"form-group mb-2"}>
                                    <p className={"text-center mb-0"}>Email</p>
                                    <input type="text" name="email-register" id="email-register" className={"mx-auto col-7 d-block rounded"} placeholder="..." />
                                </div>
                                <div className={"form-group mb-2"}>
                                    <p className={"text-center mb-0"}>New Password</p>
        					        <input type="password" name="pass-register" id="pass-register" className={"mx-auto col-7 d-block rounded"} placeholder="..." />
        					    </div>
        					    <div className={"form-group mb-4"}>
        					        <p className={"text-center mb-0"}>Confirm Password</p>
        					        <input type="password" name="pass-confirm" id="pass-confirm" className={"mx-auto col-7 d-block rounded"} placeholder="..." />
        					    </div>
        					    <button type="submit" name="register" className={"btn btn-outline-success mx-auto my-4 col-3 d-block"}>Register</button>
                            </form>
                        </div>
                    </div>
                </div>
            );
        }
    }
    
    try { ReactDOM.render(<Register />, document.getElementById("register")); } catch (e) {}
    
    /***************************************************************************************/
    /** PROFILE OPTIONS ********************************************************************/
    /***************************************************************************************/
    
    class Profile extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                isLoggedIn: ele == null ? false : true,
                isTwitter: document.getElementById("twitter-flag") != null ? true : false,
                whatContent: 0
            };
        }
        
        handleChangePassword() {
            window.location.href = host + "change";
        }
        
        render() {
            return (
                <div>
                    <MenuBar isLoggedIn={this.state.isLoggedIn} />
                    <GenerateHandlebarsAlert type={'blocked-single'} source={`{{#if success_msg}}<div class="alert alert-success rounded-0 text-center">{{success_msg}}</div>{{/if}}
            {{#if error_msg}}<div class="alert alert-danger rounded-0 text-center">{{error_msg}}</div>{{/if}}
            {{#if error}}<div class="alert alert-danger rounded-0 text-center">{{error}}</div>{{/if}}
            {{#if success}}<div class="alert alert-success rounded-0 text-center">{{success}}</div>{{/if}}`} />
                    <div className={"container col-xs-10 col-sm-8 col-md-6 col-lg-4"}>
                        <div className={"col-12 justify-content-center bg-light border border-info rounded ml-2 mt-4 py-2"}>
                            <GetContent whatContent={this.state.whatContent} isTwitter={this.state.isTwitter} />
                            <hr />
                            <GetDropdown whatContent={this.state.whatContent} handleCP={this.handleChangePassword.bind(this)} />
                        </div>
                    </div>
                </div>
            );
        }
    }
    
    try { ReactDOM.render(<Profile />, document.getElementById("profile")); } catch (e) {}
    
    
    class Change extends React.Component {
        constructor(props) {
            super(props);
            
            this.state = {
                isLoggedIn: ele == null ? false : true,
                isTwitter: document.getElementById("twitter-flag") != null ? true : false,
                whatContent: 1
            };
        }
        
        handleMainProfile() {
            window.location.href = host + "profile";
        }
        
        render() {
            return (
                <div>
                    <MenuBar isLoggedIn={this.state.isLoggedIn} />
                    <div className={"container col-xs-10 col-sm-8 col-md-6 col-lg-4"}>
                        <div className={"col-12 justify-content-center bg-light border border-info rounded ml-2 mt-4 py-2"}>
                            <GenerateHandlebarsAlert type={'stacked-group'} source={`{{#if errors}}{{#each errors}}<div class="alert alert-danger rounded-0 p-0 text-center">{{msg}}</div>{{/each}}{{/if}}`} />
                            <GetContent whatContent={this.state.whatContent} isTwitter={this.state.isTwitter} />
                            <hr />
                            <GetDropdown whatContent={this.state.whatContent} handleMP={this.handleMainProfile.bind(this)} />
                        </div>
                    </div>
                </div>
            );
        }
    }
    
    try { ReactDOM.render(<Change />, document.getElementById("change")); } catch (e) {}
    
    /***************************************************************************************/
    /** CREATE AND POLL ********************************************************************/
    /***************************************************************************************/
    
    class DynamicForm extends React.Component {
        constructor(props) {
            super(props);
        }
        
        componentWillMount() {
            this.contents = [];
            for (let i = 0; i < this.props.options; i++) {
                this.contents.push(<input type="text" key={i + 1} name={"input" + (i + 1)} id={"input" + (i + 1)} className={"col-6 d-block mx-auto"} placeholder="..." />);
            }
        }
        
        componentWillUpdate(nextProps, nextState) {
            if (this.props.options < nextProps.options) {
                this.contents.push(<input type="text" key={nextProps.options} name={"input" + nextProps.options} id={"input" + nextProps.options} className={"col-6 d-block mx-auto"} placeholder="..." />);
            }
            else {
                this.contents.pop();
            }
        }
        
        render() {
            return this.contents;
        }
    }
    
    class Create extends React.Component {
        constructor(props) {
            super(props);
            
            this.state = {
                isLoggedIn: ele == null ? false : true,
                availableOptions: 2
            };
        }
        
        handleAdd(e) {
            e.preventDefault();
            this.setState({
                availableOptions: (this.state.availableOptions + 1)
            });
        }
        
        handleDelete(e) {
            e.preventDefault();
            if (this.state.availableOptions > 2) {
                this.setState({
                    availableOptions: (this.state.availableOptions - 1)
                });
            }
            else {
                const element = document.createElement("div");
                element.className = "alert alert-danger text-center mt-2";
                element.innerHTML = "You need at least two options";
                const parent = document.getElementById("error-hook");
                parent.insertBefore(element, parent.childNodes[1]);
                        
                setTimeout(() => {
                    parent.removeChild(element);
                }, 2500);
            }
        } 
        
        handleKeyPress(e) {
            if (e.key == 'Enter') {
                e.preventDefault();
            }
        }
        
        render() {
            return (
                <div>
                    <MenuBar isLoggedIn={this.state.isLoggedIn} />
                    <div className={"container col-xs-12 col-sm-10 col-md-8 col-lg-6 mt-3"}>
                        <div id="error-hook" className={"bg-light border border-primary rounded justify-content-center py-2"}>
                            <GenerateHandlebarsAlert type={'stacked-group'} source={`{{#if errors}}{{#each errors}}<div class="alert alert-danger rounded-0 p-0 text-center">{{msg}}</div>{{/each}}{{/if}}`} />
                            <p className={"text-center mb-1"}>What is the question?</p>
                            <textarea form="createForm" name="question" id="question" rows="4" cols="40" className={"rounded d-block mx-auto"}></textarea>
                            <form method="post" action={host + "create"} id="createForm" className={"justify-content-center"} onKeyPress={this.handleKeyPress.bind(this)}>
                                <p className={"text-center mt-3 mb-1"}>What are the options?</p>
                                <DynamicForm options={this.state.availableOptions} />
                                <div className={"row justify-content-center mt-2"}>
                                    <button className={"btn btn-outline-danger mr-1"} onClick={this.handleDelete.bind(this)}>Delete</button>
                                    <button className={"btn btn-outline-success ml-1"} onClick={this.handleAdd.bind(this)}>Add</button>
                                </div>
                                <button type="submit" name="create" className={"btn btn-primary d-block mx-auto mt-3"}>Create Poll</button>
                            </form>
                        </div>
                    </div>
                </div>
            );
        }
    }
    
    try { ReactDOM.render(<Create />, document.getElementById("create")); } catch (e) {}
    
    
    function DynamicDropdown(props) {
        let items = [];
        
        props.options.forEach((el, i) => {
            items.push(<a className={"dropdown-item"} id={i.toString()} key={el + i.toString()} onClick={props.handleSelection}>{el}</a>);
        });
    
        return items;
    }
    
    class Poll extends React.Component {
        constructor(props) {
            super(props);
            
            this.state = {
                isLoggedIn: ele == null ? false : true,
                pollId: document.getElementById("poll-id").innerHTML,
                question: '',
                options: [],
                votes: [],
                bgArray: [],
                bdArray: [],
                voteIndex: null
            };
        }
        
        componentDidMount() {
            console.log('mount');
            
            $.get('/poll/request/' + this.state.pollId, (metadata) => {
                console.log(metadata);
                
                this.setState({
                    question: metadata.question,
                    options: metadata.options,
                    votes: metadata.votes,
                    bgArray: metadata.bgColors,
                    bdArray: metadata.bdColors
                });
            });
        }
        
        retrieveData() {
            let datasets = [];
            
            for (let i = 0; i < this.state.options.length; i++) {
                datasets[i] = {
                    label: this.state.options[i],
                    data: this.state.votes[i], // removed: [...]
                    backgroundColor: this.state.bgArray[i],
                    borderColor: this.state.bdArray[i]
                };
            }
            
            return datasets;
        }
        
        componentDidUpdate() {
            $(document).ready(() => {
                if (this.state.votes.filter(i => i !== 0).length !== 0) {
                    const ctx = document.getElementById("pollChart").getContext("2d");
                    const data = this.retrieveData();
                    
                    window.poll = new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            datasets: [{
                                data: data.map(item => item.data),
                                backgroundColor: data.map(item => item.backgroundColor),
                                label: 'Poll Data'
                            }],
                            labels: data.map(item => item.label)
                        },
                        options: {
                            responsive: false,
                            legend: {
                                position: 'top',
                                onClick: (e) => { e.stopPropagation(); }
                            },
                            title: {
                                display: true,
                                text: 'Poll Results'
                            },
                            animation: {
                                animationScale: true,
                                animationRotate: true
                            }
                        }
                    });
                }
            });
        }
        
        handleVote() {
            $.ajax({
                url: host + 'poll/' + this.state.pollId,
                dataType: 'json',
                type: 'PUT',
                data: {voteIndex: this.state.voteIndex},
                success: (result) => {
                    if (result.errors) {
                        const element = document.createElement("div");
                        element.className = "alert alert-danger text-center mt-2";
                        element.innerHTML = "You can only vote once per poll";
                        const parent = document.getElementById("error-hook");
                        parent.insertBefore(element, parent.childNodes[1]);
                        
                        setTimeout(() => {
                            parent.removeChild(element);
                        }, 2500);
                    }
                    else {
                        this.setState({
                            votes: result
                        });
                    }
                }
            });
        }
        
        handleSelection(e) {
            document.getElementById("dropdown-header").innerHTML = e.target.innerHTML;
            
            this.setState({
                voteIndex: +e.target.id
            });
        }
        
        render() {
            return (
                <div>
                    <MenuBar isLoggedIn={this.state.isLoggedIn} />
                    <div className={"container col-10"}>
                        <div className={"bg-light rounded border border-info p-2 mt-3"}>
                            <div className={"row m-2"}>
                                <div className={"col-md-6 col-sm-12"} id="error-hook">
                                    <GenerateHandlebarsAlert type={'stacked-group'} source={`{{#if errors}}{{#each errors}}<div class="alert alert-danger rounded-0 p-0 text-center">{{msg}}</div>{{/each}}{{/if}}`} />
                                    <h3 className={"text-dark text-center"}>{this.state.question}</h3>
                                    <div className={"row justify-content-center mb-0"}>
                                        <div className={"btn-group my-3"}>
                                            <button type="button" id="dropdown-header" className={"btn btn-secondary btn-sm dropdown-toggle mr-1"} style={{borderRadius: "5px 0 0 5px"}} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Voting Options</button>
                                            <div className={"dropdown-menu"}>
                                                <DynamicDropdown handleSelection={this.handleSelection.bind(this)} options={this.state.options}/>
                                            </div>
                                        </div>
                                        <button onClick={this.handleVote.bind(this)} id="submit" className={"btn btn-success mt-3"} style={{height: "31px", fontSize: "10px", borderRadius: "0 5px 5px 0"}}>Submit</button>
                                    </div>
                                    <hr />
                                    <form method="post" action={host + 'poll/' + this.state.pollId} className={"justify-content-center mb-4"}>
                                        <div className={"form-group"}>
                                            <p className={"text-center mb-1"}>Prefer to create and vote for a new option?</p>
                                            <input type="text" name="new-option" id="new-option" className={"col-xs-10 col-sm-8 d-block mx-auto"} placeholder="Type it out here..." />
                                        </div>
                                        <button type="submit" name="optionify" className={"btn btn-primary d-block mx-auto"}>Create and Submit</button>
                                    </form>
                                    <hr />
                                    <a href={"https://twitter.com/intent/tweet?text=" + this.state.question + "&url=" + host + "poll/" + this.state.pollId + "&via=FCC-Voting"} className={"btn btn-info d-block mx-auto"}>
                                        <span className={"fa fa-twitter"}></span> Tweet this Poll!
                                    </a>
                                </div>
                                <div className={"col-md-6 col-sm-12"}>
                                    { this.state.votes.filter(i => i !== 0).length !== 0 ? <canvas id="pollChart" height={350} width={275}></canvas> : <p className={"text-center my-5"}>Be the first to vote!</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
    
    try { ReactDOM.render(<Poll />, document.getElementById("poll")); } catch (e) {}
    
});