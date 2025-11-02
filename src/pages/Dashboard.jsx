import {useLoaderData, Link} from 'react-router-dom'
import {Button, Group, Paper, Stack, Text, Title} from "@mantine/core";


const Dashboard = () => {
    // 1. Get data from the loader, not from useState!
    // send data through protectedLoader
    // const { subscriptions } = useLoaderData();
    const subscriptions = []

    return (
        <Stack>
            <Title order={2}>Dashboard</Title>
            <Text>Here are your active subscriptions:</Text>

            {subscriptions.length === 0 ? (
                <Text>You have no subscriptions yet.</Text>
            ) : (
                // write logic to map subscription
                <p>Display fetched Subscription</p>
                // subscriptions.map(sub => (
                //     <Paper key={sub.id} p="md" withBorder>
                //         <Group justify="space-between">
                //             <Text fw={500}>{sub.name}</Text>
                //             <Text>${sub.amount.toFixed(2)}</Text>
                //             // refactor later with correct edit route
                //             <Button component={Link} to={`/edit/${sub.id}`} variant="outline">
                //                 Edit
                //             </Button>
                //         </Group>
                //     </Paper>
                // ))
            )}
        </Stack>
    )
}

export default Dashboard;