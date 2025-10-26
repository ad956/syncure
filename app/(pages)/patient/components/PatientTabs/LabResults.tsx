import React from "react";
import { Button } from "@nextui-org/react";
import { FiDownload, FiCalendar } from "react-icons/fi";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { IoFlaskOutline } from "react-icons/io5";
import { useLabResults } from "@lib/hooks/patient";

const LabResults: React.FC = () => {
  const { labResults, isLoading: loading } = useLabResults();

  if (loading) {
    return <div className="flex justify-center p-4">Loading...</div>;
  }

  if (labResults.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 bg-blue-50 rounded-full mb-4">
          <IoFlaskOutline className="text-blue-500 text-3xl" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No Lab Results Yet
        </h3>
        <p className="text-sm text-gray-500">
          Your test results will appear here once available
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bills-scroll space-y-4 pr-2">
      {labResults.map((result) => {
        const isNormal = result.status === 'Normal';
        const statusColor = isNormal ? 'green' : result.status === 'Critical' ? 'red' : 'yellow';
        
        return (
          <div key={result._id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-${statusColor}-100 rounded-full flex items-center justify-center`}>
                  {isNormal ? (
                    <FaCheckCircle className={`text-${statusColor}-600 w-5 h-5`} />
                  ) : (
                    <FaExclamationTriangle className={`text-${statusColor}-600 w-5 h-5`} />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{result.test_name}</h3>
                  <p className="text-sm text-gray-500">{result.lab_name}</p>
                </div>
              </div>
              <span className={`bg-${statusColor}-100 text-${statusColor}-700 text-xs px-2 py-1 rounded-full`}>
                {result.status}
              </span>
            </div>
            
            <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
              <FiCalendar className="w-4 h-4" />
              <span>{new Date(result.test_date).toLocaleDateString()}</span>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-800 mb-2">Result:</h4>
              <p className="text-sm font-semibold text-gray-800">{result.result_value}</p>
            </div>
            
            <Button
              variant="bordered"
              size="sm"
              startContent={<FiDownload className="w-4 h-4" />}
              className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
              onPress={() => result.report_url && window.open(result.report_url, '_blank')}
              isDisabled={!result.report_url}
            >
              {result.report_url ? 'Download Report' : 'Report Not Available'}
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default LabResults;
