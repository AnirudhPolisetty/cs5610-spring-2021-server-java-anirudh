(function () {
    var $usernameFld, $passwordFld;
    var $firstNameFld, $lastNameFld, $roleFld;
    var $removeBtn, $editBtn, $createBtn, $updateBtn;
    var $tbody;
    var userService = new AdminUserServiceClient();
    var users = [];
    var selectedUser = null;

    function createUser(user) {
        if(user.password === "" || user.firstName === "" || user.lastName === "" || user.username === "") {
            alert('Please fill the fields!')
        }
        else {
            userService.createUser(user)
                .then(function (actualUser) {
                    users.push(actualUser)
                    renderUsers(users)
                })
        }
    }

    function deleteUser(event) {
        //console.log(event.target)
        var deleteBtn = $(event.target)
        var theIndex = deleteBtn.attr("id")
        var theId = users[theIndex]._id
        //console.log(theIndex)

        userService.deleteUser(theId)
            .then(function (status) {
                //console.log(status)
                users.splice(theIndex, 1)
                renderUsers(users)
            })
    }


    function selectUser(event) {
        var selectBtn = $(event.target)
        var theId = selectBtn.attr("id")
        selectedUser = users.find(user => user._id === theId)
        $usernameFld.val(selectedUser.username)
        $passwordFld.val(selectedUser.password)
        $firstNameFld.val(selectedUser.firstName)
        $lastNameFld.val(selectedUser.lastName)
        $roleFld.val(selectedUser.role)
    }

    function updateUser() {
        selectedUser.username = $usernameFld.val()
        selectedUser.password = $passwordFld.val()
        selectedUser.firstName = $firstNameFld.val()
        selectedUser.lastName = $lastNameFld.val()
        selectedUser.role = $roleFld.val()
        //selectedUser._nuid = "001029510"
        //selectedUser._domain = "users"
        //console.log(selectedUser._id)
        userService.updateUser(selectedUser._id, selectedUser)
            .then(function (status) {
                //console.log(status)
                var index = users.findIndex(user => user._id === selectedUser._id)
                users[index] = selectedUser
                renderUsers(users)
                $usernameFld.val("")
                $passwordFld.val("")
                $firstNameFld.val("")
                $lastNameFld.val("")
            })
    }

    function renderUsers(users) {
        //console.log(users)
        $tbody.empty()
        for (var i = 0; i < users.length; i++) {
            var user = users[i]
            $tbody
                .append(`
                    <tr>
                        <td>${user.username}</td>
                        <td class="wbdv-body-password">${user.password}</td>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.role}</td>
                        <td>
                            <span class="pull-right">
                                <i class="fa-2x fa fa-times wbdv-remove" id="${i}"></i>
                                <i class="fa-2x fa fa-pencil wbdv-edit" id="${user._id}"></i>
                            </span>
                        </td>
                    </tr>
                `)
        }
        $(".wbdv-body-password").empty()
        $tbody.css("background-color","#D5F3FE")
        $(".wbdv-remove")
            .click(deleteUser)
        $(".wbdv-edit")
            .click(selectUser)
    }

    function findAllUsers() {
        userService.findAllUsers()
            .then(function (actualUsers) {
                users = actualUsers
                renderUsers(users)
            })
    }

    //function findUserById() { … } // optional - might not need this

    function main() {
        $usernameFld = $(".wbdv-username");
        $passwordFld = $(".wbdv-password");
        $firstNameFld = $(".wbdv-first-Name");
        $lastNameFld = $(".wbdv-last-Name");
        $roleFld = $(".wbdv-role");
        $createBtn = $(".wbdv-create");
        $removeBtn = $(".wbdv-remove");
        $editBtn = $(".wbdv-edit");
        $updateBtn = $(".wbdv-update");
        $searchBtn = $(".wbdv-search");
        $tbody = $(".wbdv-tbody");
        //$userRowTemplate = $(".wbdv-template");

        findAllUsers()

        $createBtn.click(() => {
            createUser({
                username: $usernameFld.val(),
                password: $passwordFld.val(),
                firstName: $firstNameFld.val(),
                lastName: $lastNameFld.val(),
                role: $roleFld.val()
            })
            $usernameFld.val("")
            $passwordFld.val("")
            $firstNameFld.val("")
            $lastNameFld.val("")
        })

        $removeBtn.click(deleteUser)
        $editBtn.click(selectUser)
        $updateBtn.click(updateUser)
    }
    $(main);
})();