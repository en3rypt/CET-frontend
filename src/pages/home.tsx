import { CardSkeleton } from "@/components/cardSkeleton";
import { ApiRoutes } from "@/constants/enum";
import useAxios from "@/hooks/useAxios";
import { Project } from "@/interface/project.interface";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

function AddProjectDialog({
  open,
  setOpen,
  handleOpen,
  fetchProjects,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpen: () => void;
  fetchProjects: () => void;
}) {
  const { postWithAuth } = useAxios();
  const projectValidationSchema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string().required(),
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    onSubmit: async (values) => {
      const response = await postWithAuth(ApiRoutes.ADD_PROJECT, values);
      if (!response.isError) {
        setOpen(false);
        fetchProjects();
      }
    },
    validationSchema: projectValidationSchema,
  });
  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader className="flex justify-center items-center">
        Add New Project
      </DialogHeader>
      <DialogBody className="w-full h-full flex justify-center items-center">
        <form
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
          onSubmit={formik.handleSubmit}
        >
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Project Name
            </Typography>
            <Input
              id="name"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              size="lg"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              crossOrigin={undefined}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Description
            </Typography>
            <Textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </div>
          <Button className="mt-6" fullWidth type="submit">
            Create Project
          </Button>
        </form>
      </DialogBody>
    </Dialog>
  );
}

function Home() {
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { getWithAuth } = useAxios();
  const navigate = useNavigate();
  const fetchProjects = async () => {
    setLoading(true);
    const response = await getWithAuth(ApiRoutes.USER);
    if (
      !response.isError &&
      response.data &&
      response.data.projects &&
      response.data.projects.length >= 0
    ) {
      const projects = response.data.projects;
      setUserProjects(projects);
    } else {
      console.log("Error fetching projects");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);
  if (loading) return <div>Loading...</div>;
  return (
    <div className="">
      <AddProjectDialog
        open={open}
        setOpen={setOpen}
        handleOpen={() => {
          setOpen((prev) => !prev);
        }}
        fetchProjects={fetchProjects}
      />
      <div className="w-full flex justify-between items-center">
        <p className="text-2xl font-medium">Projects</p>
        <Button
          className="px-3 py-1.5 text-xs font-medium"
          onClick={() => {
            setOpen(true);
          }}
        >
          Add Project
        </Button>
      </div>
      <div
        className="grid grid-flow-row gap-3 auto-rows-max"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}
      >
        {userProjects.map((project) => (
          <CardSkeleton
            key={project._id}
            title={project.name}
            description={project.description}
            onClick={() => {
              navigate(`project/${project._id}`);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
