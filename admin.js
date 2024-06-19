$(document).ready(function() {
    fetchUsers();

    function fetchUsers() {
        $.ajax({
            url: '/admin/users',
            method: 'GET',
            success: function(users) {
                let userTableBody = $('#userTable tbody');
                userTableBody.empty();
                users.forEach(user => {
                    let userRow = `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.username}</td>
                            <td>${user.email}</td>
                            <td>${user.role}</td>
                            <td>
                                <button class="btn btn-sm btn-primary edit-user" data-id="${user.id}">Edit</button>
                                <button class="btn btn-sm btn-danger delete-user" data-id="${user.id}">Delete</button>
                            </td>
                        </tr>
                    `;
                    userTableBody.append(userRow);
                });

                $('.edit-user').on('click', handleEditUser);
                $('.delete-user').on('click', handleDeleteUser);
            },
            error: function() {
                alert('Error fetching users');
            }
        });
    }

    function handleEditUser() {
        let userId = $(this).data('id');
        let username = prompt('Enter new username:');
        let email = prompt('Enter new email:');
        let role = prompt('Enter new role:');

        $.ajax({
            url: `/admin/user/${userId}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ username, email, role }),
            success: function() {
                alert('User updated successfully');
                fetchUsers();
            },
            error: function() {
                alert('Error updating user');
            }
        });
    }

    function handleDeleteUser() {
        let userId = $(this).data('id');

        if (confirm('Are you sure you want to delete this user?')) {
            $.ajax({
                url: `/admin/user/${userId}`,
                method: 'DELETE',
                success: function() {
                    alert('User deleted successfully');
                    fetchUsers();
                },
                error: function() {
                    alert('Error deleting user');
                }
            });
        }
    }
});
