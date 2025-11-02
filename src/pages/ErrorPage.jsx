import {Link, useRouteError} from 'react-router-dom'
import {Button, Center, Stack, Title} from "@mantine/core";



const ErrorPage = () => {
    const error = useRouteError();
    console.error(error);


    return (
        <Center h="100vh">
            <Stack align="center">
                <Title order={1}>Oops!</Title>
                <Text>Sorry, an unexpected error has occurred.</Text>
                <Text c="dimmed">
                    <i>{error.statusText || error.message}</i>
                </Text>
                {/* refactor later with component instead of Link*/}
                <Button component={Link} to="/">
                    Go Back Home
                </Button>
            </Stack>
        </Center>
    )
}

export default ErrorPage;