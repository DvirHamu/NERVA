from dotenv import load_dotenv
from mem0 import MemoryClient
import logging
import json

load_dotenv(dotenv_path="./tokens/.env")
user_name = 'dev'
assistant_name = 'dev-assistant'
mem0 = MemoryClient()

def add_memory():
    
    messages_formatted = [
        {        "role": "user",
            "content": "I really like Linkin Park."
        },
        {
            "role": "assistant",
            "content": "That is a good choice."
        },
        {
            "role": "user",
            "content": "I think so too."
        },
        {
            "role": "assistant",
            "content": "What is your favorite song by them?"
        },
    ]

    mem0.add(messages_formatted, user_id="dev")

def get_memory_by_query():
    mem0 = MemoryClient()
    #query = f"What helps {user_name} when stressed?"
    # results = mem0.search(query, 
    #                       filters={
    #                           "OR": [
    #                               {
    #                                   "user_id": "dev"
    #                               }
    #                           ]
    #                       },
    #                       )
    #results = results["results"]

    results = mem0.get_all(
        filters={
            "OR": [
                {
                    "user_id": user_name
                }
            ]
        }
    )
    print(results)
    results = results["results"]

    memories = []
    for result in results:
        memories.append({
            "memory": result["memory"],
            "updated_at": result["updated_at"]
        })

    memories_str = json.dumps(memories)

    print(f"Memories: {memories_str}")
    return memories_str


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    #add_memory()
    #get_memory_by_query()

    mem0 = MemoryClient()
    mem0.delete_all(user_id=user_name)