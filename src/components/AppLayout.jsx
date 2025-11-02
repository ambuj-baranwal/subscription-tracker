import {AppShell, Burger, Group, NavLink, Title} from '@mantine/core'
import {Outlet, Link, useLocation} from 'react-router-dom'
import {IconGauge, IconPlus} from '@tabler/icons-react'
import {useDisclosure} from "@mantine/hooks";
import {useAuth} from "../store/AuthContext.jsx";

const AppLayout = () => {

    const [opened, { toggle }] = useDisclosure()
    const { logout } = useAuth()
    const location = useLocation()
    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <Title order={3}>Subscription Tracker</Title>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <NavLink
                    label="Dashboard"
                    leftSection={<IconGauge size="1rem" stroke={1.5} />}
                    component={Link}
                    to="/"
                    active={location.pathname === '/'}
                />
                <NavLink
                    label="Add Subscription"
                    leftSection={<IconPlus size="1rem" stroke={1.5} />}
                    component={Link}
                    to="/add"
                    active={location.pathname === '/add'}
                />
                {/* logout NavLink can be added here bu checking user login status */}
            </AppShell.Navbar>

            <AppShell.Main>
                {/* The child routes render here */}
                <Outlet />
            </AppShell.Main>
        </AppShell>
    )
}

export default AppLayout