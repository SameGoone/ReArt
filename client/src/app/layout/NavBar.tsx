import { Button, Container, Menu, MenuItem, Dropdown, Image } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { Link, NavLink } from "react-router-dom";
import { useStore } from "../stores/store";

export default observer(function NavBar() {
    const { userStore: { authorizedUser: user, logout } } = useStore();

    const avatarStyle: React.CSSProperties = {
        width: '35px',
        height: '35px',
        borderRadius: '50%',
        objectFit: 'cover'
    };

    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item as={NavLink} to='/' header>
                    <img src="/assets/logo.png" alt="logo" style={{ marginRight: '10px' }} />
                    ReArt
                </Menu.Item>
                <Menu.Item as={NavLink} to='/posts' name="Posts" />
                <Menu.Item as={NavLink} to='/errors' name="Errors" />
                <Menu.Item>
                    <Button as={NavLink} to='/createPost' positive content='Create Post' />
                </Menu.Item>
                <MenuItem position="right">
                    <Image
                        src={!!user?.image 
                                ? `data:image/${user.image.format};base64,${user.image.base64Data}` 
                                : '/assets/user.png'}
                        style={avatarStyle}
                        alt='User avatar'
                        avatar spaced='right'
                    />
                    <Dropdown pointing='top left' text={user?.displayName}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to={`/users/${user?.id}`} text='My Profile' icon='user' />
                            <Dropdown.Item onClick={logout} text='Logout' icon='power' />
                        </Dropdown.Menu>
                    </Dropdown>
                </MenuItem>
            </Container>
        </Menu>
    )
})