import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

export function CardSkeleton({
  title,
  description,
  buttonText = "View More",
  onClick,
}: {
  title: string;
  description: string;
  buttonText?: string;
  onClick: () => void;
}) {
  return (
    <Card className="">
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          {title}
        </Typography>
        <Typography>{description}</Typography>
      </CardBody>
      <CardFooter className="pt-0">
        <Button onClick={onClick}>{buttonText}</Button>
      </CardFooter>
    </Card>
  );
}
