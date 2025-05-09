export type JointNode = {
  name: string
  children: JointNode[]
}

export const JOINT_HIERARCHY: JointNode = {
  name: "LeftHandRig",
  children: [
    {
      name: "wrist",
      children: [
        {
          name: "wrist_to_thumb",
          children: [
            {
              name: "thumb-0",
              children: [
                {
                  name: "thumb-1",
                  children: [
                    {
                      name: "thumb-2",
                      children: [
                        {
                          name: "thumb-3",
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "wrist_to_index",
          children: [
            {
              name: "index-0",
              children: [
                {
                  name: "index-1",
                  children: [
                    {
                      name: "index-2",
                      children: [
                        {
                          name: "index-3",
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "wrist_to_mid",
          children: [
            {
              name: "mid-0",
              children: [
                {
                  name: "mid-1",
                  children: [
                    {
                      name: "mid-2",
                      children: [
                        {
                          name: "mid-3",
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "wrist_to_ring",
          children: [
            {
              name: "ring-0",
              children: [
                {
                  name: "ring-1",
                  children: [
                    {
                      name: "ring-2",
                      children: [
                        {
                          name: "ring-3",
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "wrist_to_pinky",
          children: [
            {
              name: "pinky-0",
              children: [
                {
                  name: "pinky-1",
                  children: [
                    {
                      name: "pinky-2",
                      children: [
                        {
                          name: "pinky-3",
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
