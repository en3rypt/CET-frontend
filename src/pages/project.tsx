import DateDayPicker from "@/components/datePicker";
import MaterialTable from "@/components/materialTable";
import { CONSTRUCTION_EXPENSE_CATGORIES } from "@/constants/data";
import { ApiRoutes } from "@/constants/enum";
import useAxios from "@/hooks/useAxios";
import { Expense } from "@/interface/expense.intrface";
import { Project } from "@/interface/project.interface";
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  Input,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as yup from "yup";

function ProjectHeader({
  title,
  description = "",
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex justify-start items-center gap-3 mt-8">
      <div className="rounded-full bg-black text-white h-12 w-12 flex justify-center items-center">
        <p className="font-semibold  text-2xl  ">{title[0].toUpperCase()}</p>
      </div>
      <div className="">
        <h1 className="text-2xl">{title}</h1>
        <p className="">{description}</p>
      </div>
    </div>
  );
}

function AddExpenseDialog({
  open,
  setOpen,
  handleOpen,
  fetchProjects,
  projectId,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpen: () => void;
  fetchProjects: () => void;
  projectId: string;
}) {
  const { postWithAuth } = useAxios();
  const [category, setCategory] = useState({ name: "", icon: "" });
  const [date, setDate] = useState<Date | undefined>();
  const projectValidationSchema = yup.object().shape({
    title: yup.string().required(),
    amount: yup.string().required(),
  });
  const formik = useFormik({
    initialValues: {
      title: "",
      amount: undefined,
    },
    onSubmit: async (values) => {
      const data = {
        title: values.title,
        amount: values.amount,
        category: category.name,
        date: date,
        projectId: projectId,
      };
      if (date !== undefined && category.name !== "") {
        const response = await postWithAuth(ApiRoutes.ADD_EXPENSE, data);
        if (!response.isError) {
          setOpen(false);
          fetchProjects();
        }
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
              Title
            </Typography>
            <Input
              id="title"
              name="title"
              onChange={formik.handleChange}
              value={formik.values.title}
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              crossOrigin={undefined}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Category
            </Typography>
            <Menu placement="bottom-start">
              <MenuHandler>
                <Button
                  ripple={true}
                  variant="text"
                  color="blue-gray"
                  className="w-full flex h-10 items-center gap-2  border  border-blue-gray-200 bg-blue-gray-500/10 pl-3"
                >
                  {category.name !== ""
                    ? `${category.icon} ${category.name}`
                    : "Select Category"}
                </Button>
              </MenuHandler>
              <MenuList className="max-h-[20rem] max-w-[18rem] z-[9999]">
                {CONSTRUCTION_EXPENSE_CATGORIES.map((category) => {
                  return (
                    <MenuItem
                      key={category.name}
                      value={category.name}
                      className="flex items-center gap-2"
                      onClick={() => setCategory(category)}
                    >
                      {category.icon} {category.name}
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Menu>
            <DateDayPicker date={date} setDate={setDate} />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Amount
            </Typography>
            <Input
              id="amount"
              type="number"
              name="amount"
              onChange={formik.handleChange}
              value={formik.values.amount}
              size="lg"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              crossOrigin={undefined}
            />
          </div>
          <Button className="mt-6" fullWidth type="submit">
            Add Expense
          </Button>
        </form>
      </DialogBody>
    </Dialog>
  );
}

function ProjectDetails() {
  const params = useParams();
  const { getWithAuth } = useAxios();
  const [open, setOpen] = useState(false);
  const [project, setProject] = useState<Project>({
    name: "",
    description: "",
    _id: "",
    expenses: [],
    users: [],
  });
  const [loading, setLoading] = useState(true);
  const fetchProject = async () => {
    setLoading(true);
    const response = await getWithAuth(`/project/${params.projectId}`);
    if (!response.isError) {
      setProject(response.data);
      setTableData(response.data.expenses);
    } else {
      console.log("Error fetching project");
    }
    setLoading(false);
  };
  const tableHead = ["Title", "Date", "Category", "Amount"];
  const [tableData, setTableData] = useState<Expense[]>([]);
  useEffect(() => {
    fetchProject();
  }, []);
  if (loading) return <div>Loading...</div>;
  return (
    <div className="">
      <AddExpenseDialog
        open={open}
        setOpen={setOpen}
        handleOpen={() => {
          setOpen((prev) => !prev);
        }}
        fetchProjects={fetchProject}
        projectId={project._id}
      />
      <ProjectHeader title={project.name} description={project.description} />
      <MaterialTable
        TABLE_HEAD={tableHead}
        TABLE_ROWS={tableData}
        onCLick={() => {
          setOpen(true);
        }}
      />
    </div>
  );
}

export default ProjectDetails;
